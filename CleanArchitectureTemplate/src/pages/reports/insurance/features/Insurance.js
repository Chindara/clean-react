import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import useAuth from 'hooks/useAuth';
import ReportService from 'services/ReportService';
import { useTheme } from '@mui/material/styles';
import ReactTable from 'components/ui/ReactTable';
import ExportExcelButton from 'components/ExportExcelButton';
import SimpleBar from 'components/third-party/SimpleBar';
import { Autocomplete, Stack, TextField } from '@mui/material';
import { PAGINATION_PROPERTIES } from 'constants/Common';
import LookupService from 'services/LookupService';
import SearchBar from 'components/SearchBar';

export default function OpenAc({ searchVisible, setSearchVisible }) {
	const theme = useTheme();
	const { companyId } = useAuth();
	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);
	const [purchaseNos, setPurchaseNos] = useState([]);
	const [selectedPurchaseId, setSelectedPurchaseId] = useState(0);

	const {
		data: { reportData, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['insurance', { page, limit, selectedPurchaseId, searchVisible }],
		queryFn: () => getInsurance(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { reportData: [], pagination: {} },
	});

	const getInsurance = async () => {
		if (!searchVisible) setSelectedPurchaseId(0);

		const { data: { items = [], ...pagination } = {} } = await ReportService.getInsurance(companyId, selectedPurchaseId, page, limit);
		return { reportData: items, pagination: pagination };
	};

	useEffect(() => {
		(async () => {
			try {
				const { data = [] } = await LookupService.getPoIds(companyId);
				const poNumberChoices = data.reduce((accumulator, object) => [...accumulator, { label: object.name, value: object.id }], []);

				setPurchaseNos(poNumberChoices);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	const handleAutoComplete = (value) => {
		if (value) {
			setSelectedPurchaseId(value.value);
		} else {
			setSelectedPurchaseId(0);
		}
	};

	const columns = useMemo(
		() => [
			{ Header: 'PO No', accessor: 'poNumber' },
			{ Header: 'Ref No', accessor: 'ref' },
			{ Header: 'Plant', accessor: 'plant' },
			{ Header: 'Supplier', accessor: 'supplier' },
			{ Header: 'Insurance Amount', accessor: 'insuranceAmount' },
			{ Header: 'Insurance Policy', accessor: 'Insurance Policy' },
			{ Header: 'Claimable Amount', accessor: 'claimableAmount' },
			{ Header: 'Claimed Amount', accessor: 'claimedAmount' },
			{ Header: 'Remarks', accessor: 'remarks' },
		],
		[theme]
	);

	return (
		<>
			<SearchBar searchVisible={searchVisible} setSearchVisible={setSearchVisible} canClose={false}>
				<Autocomplete
					id='poNumbers'
					options={purchaseNos}
					getOptionLabel={(option) => option.label}
					filterSelectedOptions
					isOptionEqualToValue={(option, value) => option?.value === value?.value}
					value={reportData?.poNumber}
					noOptionsText={'No Results'}
					clearOnBlur
					onChange={(event, value) => handleAutoComplete(value)}
					renderInput={(params) => <TextField {...params} placeholder='Filter by Purchase Orders' />}
					style={{ width: 300 }}
				/>
				<ExportExcelButton title='Export to Excel' filename='Insurance' headers={columns.map((x) => x.Header)} data={reportData} />
			</SearchBar>

			<SimpleBar>
				<ReactTable
					data={reportData}
					columns={columns}
					paginate={true}
					pagination={pagination}
					page={page}
					limit={limit}
					setPage={setPage}
					setLimit={setLimit}
					isFetching={isFetching}
				/>
			</SimpleBar>
		</>
	);
}

OpenAc.propTypes = {
	value: PropTypes.any,
	searchVisible: PropTypes.bool,
	setSearchVisible: PropTypes.func,
};
