import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { startOfDay, endOfDay } from 'date-fns';

// MUI
import { useTheme } from '@mui/material/styles';
import { Link, Chip, Box, InputLabel, TextField, Grid } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import RemoveIcon from '@mui/icons-material/Remove'; // Correct import from @mui/icons-material

//DATERANGE
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// THIRD-PARTY
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';

// PROJECT IMPORT
import ReactTable from 'components/ui/ReactTable';
import SimpleBar from 'components/third-party/SimpleBar';
import SearchBar from 'components/SearchBar';
import PurchaseOrderKebabMenu from '../../components/PurchaseOrderKebabMenu';

// SERVICES
import PurchaseOrderService from 'services/PurchaseOrderService';

// CONSTANTS
import { CONTROL_SIZE, PAGINATION_PROPERTIES, PURCHASE_ORDER_STATUS_COLOR } from 'constants/Common';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';
import { useDebouncedCallback } from 'use-debounce';

// ==============================|| COMPANY LIST ||============================== //

export default function PurchaseOrderList({ searchVisible, setSearchVisible }) {
	const theme = useTheme();
	const navigate = useNavigate();
	const { userId, companyId } = useAuth();
	const [purchaseNo, setPurchaseNo] = useState('');

	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);

	const [toDate, setToDates] = useState(null);
	const [fromDate, setFromDates] = useState(null);

	const {
		data: { purchaseOrders, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['purchaseOrder', { page, limit, purchaseNo, toDate, fromDate, searchVisible }],
		queryFn: () => getPurchaseOrders(),
		keepPreviousData: false,
		refetchOnWindowFocus: false,
		initialData: { purchaseOrders: [], pagination: {} },
	});

	const getPurchaseOrders = async () => {
		const newToDate = toDate ? startOfDay(toDate).toISOString() : '';
		const newFromDate = fromDate ? endOfDay(fromDate).toISOString() : '';
		if ((!newFromDate && newToDate) || (newFromDate && !newToDate)) {
			return { purchaseOrders: [], pagination: {} };
		}
		const { data: { items = [], ...pagination } = {} } = await PurchaseOrderService.getAll(companyId, purchaseNo, newToDate, newFromDate, page, limit, searchVisible);
		return { purchaseOrders: items, pagination: pagination };
	};

	const debounced = useDebouncedCallback(async (value) => {
		setPurchaseNo(value);
	}, 500);

	const onChange = (event) => {
		const { name, value } = event.target;
		debounced(value);
	};

	// Reset fields when searchVisible changes to false
	useEffect(() => {
		if (!searchVisible) {
			resetFields();
		}
	}, [searchVisible]);

	const resetFields = () => {
		setPurchaseNo('');
		setToDates(null);
		setFromDates(null);
	};

	const columns = useMemo(
		() => [
			{
				Header: '#',
				accessor: 'sequenceNo',
			},
			{
				Header: 'PO Number',
				accessor: 'poNo',
				Cell: ({ row, value }) => (
					<Link
						underline='hover'
						color={theme.palette.mode === 'dark' ? '#FFFFFF' : '#262626'}
						onClick={() => navigate(`form?mode=${OPERATION_MODE.Edit}&id=${row?.original?.id}`)}
						sx={{ cursor: 'pointer' }}
					>
						{value}
					</Link>
				),
			},
			{
				id: 'actions-column',
				className: 'cell-center',
				disableSortBy: true,
				Cell: ({ row }) => {
					return <PurchaseOrderKebabMenu row={row} />;
				},
			},
			{
				Header: 'Date of Delivery',
				accessor: 'dateOfDelivery',
				Cell: ({ value }) => <InputLabel style={{ textAlign: 'center' }}>{moment(value).format('yyyy-MM-DD')}</InputLabel>,
			},
			{
				Header: 'PO Date',
				accessor: 'poDate',
				Cell: ({ value }) => <InputLabel style={{ textAlign: 'center' }}>{moment(value).format('yyyy-MM-DD')}</InputLabel>,
			},
			{
				Header: 'Vendor',
				accessor: 'vendorName',
			},
			{
				Header: 'Amount',
				accessor: 'amount',
				Cell: ({ row }) => (
					<InputLabel style={{ float: 'right' }}>
						{row.original.currency}&nbsp;
						{Number(row.original.amount).toLocaleString('en-US', {
							style: 'decimal',
							maximumFractionDigits: 2,
							minimumFractionDigits: 2,
						})}
					</InputLabel>
				),
			},
			{
				Header: 'Payment Method',
				accessor: 'paymentMethod',
				Cell: ({ value }) => <InputLabel style={{ textAlign: 'center' }}>{value}</InputLabel>,
			},
			{
				Header: 'Status',
				accessor: 'status',
				Cell: ({ value }) => <Chip label={value} size='small' variant='light' color={PURCHASE_ORDER_STATUS_COLOR[value] ?? 'default'} />,
			},
			{
				Header: 'Created',
				accessor: 'created',
				Cell: ({ value }) => <InputLabel style={{ textAlign: 'center' }}>{moment(value).format('yyyy-MM-DD HH:mm')}</InputLabel>,
			},
			{
				Header: 'Modified',
				accessor: 'modified',
				Cell: ({ value }) => <InputLabel style={{ textAlign: 'center' }}>{moment(value).format('yyyy-MM-DD HH:mm')}</InputLabel>,
			},
		],
		[theme]
	);

	return (
		<>
			<SearchBar searchVisible={searchVisible} setSearchVisible={setSearchVisible}>
				<TextField
					sx={{ width: 400 }}
					placeholder='Filter by Purchase Order No'
					size={CONTROL_SIZE}
					name='purchaseNo'
					value={purchaseNo}
					onChange={onChange}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start' sx={{ color: theme.palette.secondary }}>
								<FilterListOutlinedIcon />
							</InputAdornment>
						),
					}}
				/>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						inputFormat='yyyy/MM/dd'
						value={toDate}
						onChange={(newValue) => {
							setToDates(newValue);
						}}
						renderInput={(params) => <TextField {...params} size={CONTROL_SIZE} />}
					/>
				</LocalizationProvider>
				<Box sx={{ display: 'flex', alignItems: 'center', mx: 1 }}>
					<RemoveIcon />
				</Box>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						inputFormat='yyyy/MM/dd'
						value={fromDate}
						onChange={(newValue) => {
							setFromDates(newValue);
						}}
						renderInput={(params) => <TextField {...params} size={CONTROL_SIZE} />}
					/>
				</LocalizationProvider>
			</SearchBar>
			<SimpleBar>
				<ReactTable
					data={purchaseOrders}
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

PurchaseOrderList.propTypes = {
	row: PropTypes.shape({
		original: PropTypes.shape({
			id: PropTypes.any,
			amount: PropTypes.number,
			currency: PropTypes.string,
		}),
	}),
	value: PropTypes.any,
	searchVisible: PropTypes.bool,
	setSearchVisible: PropTypes.func,
};
