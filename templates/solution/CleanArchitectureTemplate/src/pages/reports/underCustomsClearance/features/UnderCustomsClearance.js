import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import useAuth from 'hooks/useAuth';
import ReportService from 'services/ReportService';
import { useTheme } from '@mui/material/styles';
import ReactTable from 'components/ui/ReactTable';
import ExportExcelButton from 'components/ExportExcelButton';
import SimpleBar from 'components/third-party/SimpleBar';
import { Autocomplete, Box, Stack, TextField } from '@mui/material';
import { CONTROL_SIZE, PAGINATION_PROPERTIES } from 'constants/Common';
import LookupService from 'services/LookupService';
import SearchBar from 'components/SearchBar';
import RemoveIcon from '@mui/icons-material/Remove'; // Correct import from @mui/icons-material

//DATERANGE
import { DateRangePicker } from 'rsuite';
import 'rsuite/DateRangePicker/styles/index.css';
import '../../../../index.css';
import moment from 'moment';
export default function UnderCustomsClearance({ searchVisible, setSearchVisible }) {
	const theme = useTheme();
	const { companyId } = useAuth();
	const [purchaseNos, setPurchaseNos] = useState([]);
	const [selectedPurchaseId, setSelectedPurchaseId] = useState(0);

	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [dateRange, setDateRange] = useState([null, null]);

	useEffect(() => {
		const today = new Date();
		const previousDate = new Date(today);
		previousDate.setDate(today.getDate() - 90);

		setStartDate(moment(previousDate).format('YYYY-MM-DD'));
		setEndDate(moment(today).format('YYYY-MM-DD'));
		setDateRange([previousDate, today]);
	}, []);

	
	const {
		data: { reportData },
		isFetching,
	} = useQuery({
		queryKey: ['underCustomsClearance', { startDate, endDate, selectedPurchaseId, searchVisible }],
		queryFn: () => getUnderCustomClearance(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { reportData: [] },
		enabled: true,
	});
	
	const setDefaultDateRange = () => {
        const today = new Date();
        const previousDate = new Date(today);
        previousDate.setDate(today.getDate() - 89);
        setEndDate(moment(today).format('YYYY-MM-DD'));
        setStartDate(moment(previousDate).format('YYYY-MM-DD'));
        setDateRange([previousDate, today]);
    };

	const getUnderCustomClearance = async () => {
		if (!searchVisible) setSelectedPurchaseId(0);

		const { data: { items = [] } }= await ReportService.getUnderCustomClearance(companyId, startDate, endDate, selectedPurchaseId, searchVisible);
		return { reportData: items };
	};

	useEffect(() => {
		if (dateRange && dateRange.length === 2) {
			const [start, end] = dateRange;
			setStartDate(start ? moment(start).format('YYYY-MM-DD') : null);
			setEndDate(end ? moment(end).format('YYYY-MM-DD') : null);
		}
	}, [dateRange]);

	useEffect(() => {
		if (searchVisible) {
			setDefaultDateRange();
		} else {
			resetFields();
		}
	}, [searchVisible]);

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
	}, [companyId]);

	const resetFields = () => {
		setPurchaseNos([]);
		setDateRange([null, null]);
	};

	const disabledDate = (date, selectDate) => {
		if (selectDate && selectDate[0]) {
			const startDate = moment(selectDate[0]).startOf('day');
			const backwardLimit = startDate.clone().subtract(89, 'days').startOf('day');
			const forwardLimit = startDate.clone().add(89, 'days').endOf('day');
			return date < backwardLimit.toDate() || date > forwardLimit.toDate();
		}
		return false;
	};

	const handleAutoComplete = (value) => {
		if (value) {
			setSelectedPurchaseId(value.value);
		} else {
			setSelectedPurchaseId(0);
		}
	};

	const columns = useMemo(
		() => [
			{ Header: 'Purchase No', accessor: 'poNumber' },
			{ Header: 'Entity', accessor: 'entity' },
			{ Header: 'Buyer', accessor: 'buyer' },
			{ Header: 'Reference No', accessor: 'ref' },
			{ Header: 'Supplier', accessor: 'supplier' },
			{ Header: 'Description', accessor: 'description' },
			{ Header: 'Currency', accessor: 'currency' },
			{ Header: 'Value', accessor: 'value' },
			{ Header: 'BI Number', accessor: 'blNumber' },
			{ Header: 'Vessel', accessor: 'vessel' },
			{ Header: 'Shipping Line', accessor: 'shippingLine' },
			{ Header: 'Payment Term', accessor: 'paymentTerm' },
			{ Header: 'Inco Term', accessor: 'incoTerm' },
			{ Header: 'Transport Mode', accessor: 'transportMode' },
			{ Header: 'Delivery Date', accessor: 'deliveryDate' },
			{ Header: 'Doc Received Date', accessor: 'docsReceivedDate' },
			{ Header: 'ETD', accessor: 'etd' },
			{ Header: 'ETA', accessor: 'eta' },
			{ Header: 'Original Doc Received Date', accessor: 'originalDocsReceivedDate' },
			{ Header: 'Shipment Type', accessor: 'shipmentType' },
			{ Header: 'Document to CHA', accessor: 'documenttoCHA' },
			{ Header: 'Pending Days from ETA', accessor: 'pendingDaysFromETA' },
			{ Header: 'Bank', accessor: 'bank' },
			{ Header: 'Endorsement', accessor: 'endorsement' },
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
				<DateRangePicker
					value={dateRange}
					onChange={(range) => {
						setDateRange(range);
					}}
					direction='horizontal'
					shouldDisableDate={disabledDate}
					size='lg'
				/>
				<ExportExcelButton title='Export to Excel' filename='UnderCustomsClearance' headers={columns.map((x) => x.Header)} data={reportData} />
			</SearchBar>

			<SimpleBar>
				<ReactTable data={reportData} columns={columns} isFetching={isFetching} />
			</SimpleBar>
		</>
	);
}

UnderCustomsClearance.propTypes = {
	value: PropTypes.any,
	searchVisible: PropTypes.bool,
	setSearchVisible: PropTypes.func,
};
