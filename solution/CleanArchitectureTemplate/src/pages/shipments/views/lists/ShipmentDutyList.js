import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// MUI
import { useTheme } from '@mui/material/styles';
import { Link, Chip, InputLabel } from '@mui/material';

// THIRD-PARTY
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';

// PROJECT IMPORT
import ReactTable from 'components/ui/ReactTable';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';

// SERVICES
import ShipmentDutyService from 'services/ShipmentDutyService';

// CONSTANTS
import { PAGINATION_PROPERTIES, SHIPMENT_STATUS_COLOR, STATUS_PROPERTIES_TABLE } from 'constants/Common';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';
import DutyKebabMenu from 'pages/shipments/components/ShipmentsDutyKebabMenu';

// ==============================|| SHIPMENT PAYMENT TYPE LIST ||============================== //\

export default function DutyList({ handleDutyForm, shipmentId }) {
	const theme = useTheme();
	const navigate = useNavigate();
	const { userId, companyId } = useAuth();

	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);

	const {
		data: { duties, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['duty'],
		queryFn: () => getGuarantees(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { guarantees: [], pagination: {} },
	});

	const getGuarantees = async () => {
		console.log(companyId);
		console.log(shipmentId);

		const temp = await ShipmentDutyService.getAll(companyId, shipmentId);

		const { data: items = [] } = await ShipmentDutyService.getAll(companyId, shipmentId);

		return { duties: items };
	};

	const columns = useMemo(
		() => [
			{
				Header: 'HS Code',
				accessor: 'hsCode',
				Cell: ({ row, value }) => (
					<Link
						underline='hover'
						color={theme.palette.mode === 'dark' ? '#FFFFFF' : '#262626'}
						onClick={() => handleDutyForm(OPERATION_MODE.View, row?.original?.id)}
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
					return <DutyKebabMenu row={row} handleClick={handleDutyForm} />;
				},
			},
			{
				Header: 'Submitted Date To Finance',
				accessor: 'Submitted Date To Finance',
				Cell: ({ value, row }) => (
					<Link
						underline='hover'
						color={theme.palette.mode === 'dark' ? '#FFFFFF' : '#262626'}
						onClick={() => handleDutyForm(OPERATION_MODE.View, row?.original?.id)}
						sx={{ cursor: 'pointer' }}
					>
						{moment(value).format('yyyy-MM-DD')}
					</Link>
				),
			},
            {
				Header: 'Payment Date',
				accessor: 'paymentDate',
				Cell: ({ value, row }) => (
					<Link
						underline='hover'
						color={theme.palette.mode === 'dark' ? '#FFFFFF' : '#262626'}
						onClick={() => handleDutyForm(OPERATION_MODE.View, row?.original?.id)}
						sx={{ cursor: 'pointer' }}
					>
						{moment(value).format('yyyy-MM-DD')}
					</Link>
				),
			},
			{
				Header: 'Payment Reference',
				accessor: 'paymentReference',
			},
			{
				Header: 'Remarks',
				accessor: 'remarks',
			},
			{
				Header: 'cid',
				accessor: 'cid',
			},
			{
				Header: 'vat',
				accessor: 'vat',
			},
			{
				Header: 'pal',
				accessor: 'pal',
			},
			{
				Header: 'xid',
				accessor: 'xid',
			},
			{
				Header: 'eic',
				accessor: 'eic',
			},
			{
				Header: 'ssl',
				accessor: 'ssl',
			},
			{
				Header: 'scl',
				accessor: 'scl',
			},
			{
				Header: 'Penalty',
				accessor: 'penalty',
			},
			{
				Header: 'surcharge',
				accessor: 'surcharge',
			},
			{
				Header: 'Additional Charges',
				accessor: 'additionalCharges',
			},
		],
		[theme]
	);

	return (
		<>
			<MainCard content={false}>
				<SimpleBar>
					<ReactTable
						data={duties}
						columns={columns}
						//paginate={true}
						//pagination={pagination}
						//page={page}
						//limit={limit}
						//setPage={setPage}
						//setLimit={setLimit}
						isFetching={isFetching}
					/>
				</SimpleBar>
			</MainCard>
		</>
	);
}

DutyList.propTypes = {
	handleDutyForm: PropTypes.func.isRequired,
	shipmentId: PropTypes.number.isRequired,
	row: PropTypes.shape({
		original: PropTypes.shape({
			id: PropTypes.any,
		}),
	}),
	value: PropTypes.any,
};
