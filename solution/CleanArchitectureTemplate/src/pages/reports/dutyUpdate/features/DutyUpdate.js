import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import useAuth from 'hooks/useAuth';
import ReportService from 'services/ReportService';
import { useTheme } from '@mui/material/styles';
import ReactTable from 'components/ui/ReactTable';
import ExportExcelButton from 'components/ExportExcelButton';
import SimpleBar from 'components/third-party/SimpleBar';
import { Autocomplete, InputLabel, Stack, TextField } from '@mui/material';
import LookupService from 'services/LookupService';
import SearchBar from 'components/SearchBar';

import moment from 'moment';
import { DateRangePicker } from 'rsuite';
import 'rsuite/DateRangePicker/styles/index.css';
import '../../../../index.css';
export default function DutyUpdate({ searchVisible, setSearchVisible }) {
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
	
		const getDutyUpdate = async () => {	
			try {
				const response = await ReportService.getDutyUpdate(companyId, startDate, endDate, selectedPurchaseId, searchVisible);
				const { items = [] } = response.data || {};
				return { reportData: items };
			} catch (error) {
				console.error('Error fetching shipment register data:', error);
				return { reportData: [] };
			}
		};
	
		const {
			data: { reportData  = []} = {},
			isFetching,
		} = useQuery({
			queryKey: ['purchaseOrderTT', { startDate, endDate, selectedPurchaseId, searchVisible }],
			queryFn: () => getDutyUpdate(),
			keepPreviousData: true,
			refetchOnWindowFocus: false,
			initialData: { reportData: [] },
			enabled: !!startDate && !!endDate,
		});
	
		useEffect(() => {
			if (dateRange && dateRange.length === 2) {
				const [start, end] = dateRange;
				setStartDate(start ? moment(start).format('YYYY-MM-DD') : null);
				setEndDate(end ? moment(end).format('YYYY-MM-DD') : null);
			}
		}, [dateRange]);
	
		const setDefaultDateRange = () => {
			const today = new Date();
			const previousDate = new Date(today);
			previousDate.setDate(today.getDate() - 89);
			setEndDate(moment(today).format('YYYY-MM-DD'));
			setStartDate(moment(previousDate).format('YYYY-MM-DD'));
			setDateRange([previousDate, today]);
		};
	
		useEffect(() => {
			if (searchVisible) {
				setDefaultDateRange();
			} else {
				resetFields();
			}
		}, [searchVisible]);
	
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

	const handleAutoComplete = (value) => {
		if (value) {
			setSelectedPurchaseId(value.value);
		} else {
			setSelectedPurchaseId(0);
		}
	};

	const columns = useMemo(
		() => [
			{ Header: 'Purchase Order', accessor: 'poNumber' },
			{ Header: 'Shipment Reference', accessor: 'ref' },
			{ Header: 'Entity', accessor: 'plant' },
			{ Header: 'Description', accessor: 'description' },
			{ Header: 'Invoice Number', accessor: 'invoiceNumber' },
			{ Header: 'blNumber', accessor: 'blNumber' },
			{ Header: 'Inco Term', accessor: 'incoTerm' },
			{ Header: 'HS Code', accessor: 'hsCode' },
			{ Header: 'ETA', accessor: 'eta' },
			{ Header: 'Cleared Date', accessor: 'clearedDate' },
			{ Header: 'Commercial Invoice Value', accessor: 'commercialInvoiceValue', Cell: ({ row }) => <InputLabel style={{ float: 'right' }}>{row.original.cid}</InputLabel> },
			{
				Header: 'CID',
				accessor: 'cid',
				Cell: ({ row }) => <InputLabel style={{ float: 'right' }}>{row.original.cid}</InputLabel>,
			},
			{ Header: 'VAT', accessor: 'vat', Cell: ({ row }) => <InputLabel style={{ float: 'right' }}>{row.original.cid}</InputLabel> },
			{ Header: 'PAL', accessor: 'pal', Cell: ({ row }) => <InputLabel style={{ float: 'right' }}>{row.original.pal}</InputLabel> },
			{ Header: 'XID', accessor: 'xid', Cell: ({ row }) => <InputLabel style={{ float: 'right' }}>{row.original.xid}</InputLabel> },
			{ Header: 'EIC', accessor: 'eic', Cell: ({ row }) => <InputLabel style={{ float: 'right' }}>{row.original.eic}</InputLabel> },
			{ Header: 'SSL', accessor: 'ssl', Cell: ({ row }) => <InputLabel style={{ float: 'right' }}>{row.original.ssl}</InputLabel> },
			{ Header: 'SCL', accessor: 'scl', Cell: ({ row }) => <InputLabel style={{ float: 'right' }}>{row.original.scl}</InputLabel> },
			{ Header: 'Penalty', accessor: 'penalty', Cell: ({ row }) => <InputLabel style={{ float: 'right' }}>{row.original.penalty}</InputLabel> },
			{ Header: 'Surcharge', accessor: 'surcharge', Cell: ({ row }) => <InputLabel style={{ float: 'right' }}>{row.original.surcharge}</InputLabel> },
			{ Header: 'Additional Duty', accessor: 'additionalDuty', Cell: ({ row }) => <InputLabel style={{ float: 'right' }}>{row.original.additionalDuty}</InputLabel> },
			{ Header: 'Total Duty', accessor: 'totalDuty', Cell: ({ row }) => <InputLabel style={{ float: 'right' }}>{row.original.totalDuty}</InputLabel> },
			{ Header: 'Remark', accessor: 'remark' },
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

				<ExportExcelButton title='Export to Excel' filename='DutyUpdate' headers={columns.map((x) => x.Header)} data={reportData} />
			</SearchBar>

			<SimpleBar>
			<ReactTable data={reportData} columns={columns} isFetching={isFetching} />
			</SimpleBar>
		</>
	);
}

DutyUpdate.propTypes = {
	row: PropTypes.shape({
		original: PropTypes.shape({
			commercialInvoiceValue: PropTypes.string,
			cid: PropTypes.string,
			vat: PropTypes.string,
			pal: PropTypes.string,
			xid: PropTypes.string,
			eic: PropTypes.string,
			ssl: PropTypes.string,
			scl: PropTypes.string,
			penalty: PropTypes.string,
			surcharge: PropTypes.string,
			additionalDuty: PropTypes.string,
			totalDuty: PropTypes.string,
		}),
	}),
	value: PropTypes.any,
	searchVisible: PropTypes.bool,
	setSearchVisible: PropTypes.func,
};
