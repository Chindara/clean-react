import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// MUI
import { useTheme } from '@mui/material/styles';
import { Link, Chip, InputLabel, Autocomplete, TextField } from '@mui/material';

// THIRD-PARTY
import { useQuery, useQueryClient } from '@tanstack/react-query';

// PROJECT IMPORT
import ReactTable from 'components/ui/ReactTable';
import NonPoShipmentKebabMenu from '../../components/NonPoShipmentKebabMenu';
import SimpleBar from 'components/third-party/SimpleBar';

// SERVICES
import NonPOShipmentService from 'services/NonPoShipmentService';

// CONSTANTS
import { PAGINATION_PROPERTIES, SHIPMENT_STATUS_COLOR } from 'constants/Common';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';
import { Stack } from '@mui/system';
import LookupService from 'services/LookupService';
//import SearchBar from 'components/SearchBar';
import moment from 'moment';

// ==============================|| SHIPMENT LIST ||============================== //\

export default function NonPoShipmentList({ handleShipmentForm, searchVisible, setSearchVisible }) {
	const theme = useTheme();
	const navigate = useNavigate();

	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);

	const { companyId } = useAuth();
	const [poNumberChoices, setPONumberChoices] = useState([]);
	const [selectedPONumber, setSelectedPONumber] = useState(0);

	const {
		data: { nonPoShipments, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['nonPoshipment', { page, limit }],
		queryFn: () => getnonPoShipments(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { nonPoShipments: [], pagination: {} },
	});

	const getnonPoShipments = async () => {
		const { data: { items = [], ...pagination } = {} } = await NonPOShipmentService.getAll(companyId, page, limit);
		return { nonPoShipments: items, pagination: pagination };
	};

	useEffect(() => {
		(async () => {
			try {
				const { data = [] } = await LookupService.getPoIds(companyId);

				const poNumberChoices = data.reduce((accumulator, object) => [...accumulator, { label: object.name, value: object.id }], []);

				setPONumberChoices(poNumberChoices);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	const queryClient = useQueryClient();

	// Then use queryClient.invalidateQueries as needed
	const handleAutoComplete = (value) => {
		if (value) {
			setSelectedPONumber(value.value);
		} else {
			setSelectedPONumber(0); // Setting selectedPONumber to 0 when no value is selected
			queryClient.invalidateQueries(['shipmentList']); // Invalidating the query to trigger data refetch
		}
	};

	const columns = useMemo(
		() => [
			{
				Header: '#',
				accessor: 'sequenceNo',
			},
			{
				Header: 'ReferenceNo',
				accessor: 'referenceNo',
				Cell: ({ row, value }) => (
					<Link
						underline='hover'
						color={theme.palette.mode === 'dark' ? '#FFFFFF' : '#262626'}
						onClick={() => navigate(`form?mode=${OPERATION_MODE.View}&id=${row?.original?.id}`)}
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
					return <NonPoShipmentKebabMenu row={row} handleClick={handleShipmentForm} />;
				},
			},
			{
				Header: 'Purchase No',
				accessor: 'poNo',
			},
			{
				Header: 'Clearing Agent',
				accessor: 'clearingAgent',
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
				Header: 'vessel',
				accessor: 'vessel',
			},
			{
				Header: 'incoTerm',
				accessor: 'incoTerm',
			},
			{
				Header: 'status',
				accessor: 'status',
				Cell: ({ value }) => <Chip label={value} size='small' variant='light' color={SHIPMENT_STATUS_COLOR[value] ?? 'default'} />,
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

	const filteredData = useMemo(() => {
		// Filter the totalCost data based on the selected PO number
		if (!selectedPONumber) return nonPoShipments;
		return nonPoShipments.filter((item) => item.poNumber === selectedPONumber);
	}, [selectedPONumber, nonPoShipments]);

	return (
		<>
			{/* <SearchBar searchVisible={searchVisible} setSearchVisible={setSearchVisible}>
				<Autocomplete
					id='poNumbers'
					options={poNumberChoices}
					getOptionLabel={(option) => option.label}
					filterSelectedOptions
					isOptionEqualToValue={(option, value) => option?.value === value?.value}
					value={nonPoShipments.poNo}
					noOptionsText={'No Results'}
					clearOnBlur
					onChange={(event, value) => handleAutoComplete(value)}
					renderInput={(params) => <TextField {...params} placeholder='Choose Purchase Order Numbers' />}
					sx={{ width: 400 }}
				/>
			</SearchBar> */}
			<SimpleBar>
				<ReactTable
					data={nonPoShipments}
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

NonPoShipmentList.propTypes = {
	handleShipmentForm: PropTypes.func.isRequired,
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
