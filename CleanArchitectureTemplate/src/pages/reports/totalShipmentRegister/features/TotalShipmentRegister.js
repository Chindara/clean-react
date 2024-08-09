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
import { DateRangePicker } from 'rsuite';
import 'rsuite/DateRangePicker/styles/index.css';
import '../../../../index.css';
import moment from 'moment';

export default function TotalShipmentRegister({ searchVisible, setSearchVisible }) {
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

	const getTotalShipmentRegister = async () => {
		if (!searchVisible) setSelectedPurchaseId(0);

		try {
			const response = await ReportService.getTotalShipmentRegister(companyId, startDate, endDate, selectedPurchaseId, searchVisible);
			const { items = [] } = response.data || {};
			return { purchaseOrders: items };
		} catch (error) {
			console.error('Error fetching shipment register data:', error);
			return { purchaseOrders: [] };
		}
	};

	const { data: { purchaseOrders = [] } = {}, isFetching } = useQuery({
		queryKey: ['totalShipmentRegister', { startDate, endDate, selectedPurchaseId, searchVisible }],
		queryFn: getTotalShipmentRegister,
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { purchaseOrders: [] },
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
			{ Header: 'Reference No', accessor: 'referenceNo' },
			{ Header: 'Entity', accessor: 'entity' },
			{ Header: 'Buyer', accessor: 'buyer' },
			{ Header: 'PO No', accessor: 'poNumber' },
			{ Header: 'Supplier', accessor: 'supplier' },
			{ Header: 'Item', accessor: 'item' },
			{ Header: 'Regulatory Approval', accessor: 'regulatoryApproval' },
			{ Header: 'Nature of Cargo', accessor: 'natureOfCargo' },
			{ Header: 'Delivery Date', accessor: 'deliveryDate' },
			{ Header: 'Bank', accessor: 'bank' },
			{ Header: 'Inco Term', accessor: 'incoTerm' },
			{ Header: 'Payment Term', accessor: 'paymentTerm' },
			{ Header: 'PI Number', accessor: 'piNumber' },
			{ Header: 'Advanced Payment Reference', accessor: 'advancedPaymentReference' },
			{ Header: 'LC Reference', accessor: 'lcReference' },
			{ Header: 'Shipment Mode', accessor: 'shipmentMode' },
			{ Header: 'Shipment Type', accessor: 'shipmentType' },
			{ Header: 'Doc Received Date', accessor: 'docReceivedDate' },
			{ Header: 'CI No', accessor: 'ciNumber' },
			{ Header: 'Currency', accessor: 'currency' },
			{ Header: 'CI Value', accessor: 'ciValue' },
			{ Header: 'BLAWB', accessor: 'blawb' },
			{ Header: 'Vessel', accessor: 'vessel' },
			{ Header: 'Quantity', accessor: 'quantity' },
			{ Header: 'ETD', accessor: 'etd' },
			{ Header: 'ETA', accessor: 'eta' },
			{ Header: 'Revised ETA', accessor: 'revisedETA' },
			{ Header: 'Documents To CHA', accessor: 'docSharedDateToClearingAgent' },
			{ Header: 'Clearing Agent', accessor: 'clearingAgent' },
			{ Header: 'Cleared Date', accessor: 'clearedDate' },
			{ Header: 'CUSDEC No', accessor: 'cusdecNo' },
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
					value={purchaseNos.find((po) => po.value === selectedPurchaseId) || null}
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

				<ExportExcelButton title='Export to Excel' filename='TotalShipmentRegister' headers={columns.map((x) => x.Header)} data={purchaseOrders} />
			</SearchBar>

			<SimpleBar>
				<ReactTable data={purchaseOrders || []} columns={columns} paginate={false} isFetching={isFetching} />
			</SimpleBar>
		</>
	);
}

TotalShipmentRegister.propTypes = {
	searchVisible: PropTypes.bool.isRequired,
	setSearchVisible: PropTypes.func.isRequired,
};
