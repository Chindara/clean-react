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
import GuaranteeService from 'services/ShipmentGuaranteeService';

// CONSTANTS
import { PAGINATION_PROPERTIES, SHIPMENT_STATUS_COLOR, STATUS_PROPERTIES_TABLE } from 'constants/Common';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';
import GuaranteeKebabMenu from 'pages/shipments/components/GuaranteeKebabMenu';

// ==============================|| SHIPMENT PAYMENT TYPE LIST ||============================== //\

export default function GuaranteeList({ handleGuaranteeForm, shipmentId }) {
	const theme = useTheme();
	const navigate = useNavigate();
	const { userId, companyId } = useAuth();

	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);

	const {
		data: { guarantees, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['guarantee'],
		queryFn: () => getGuarantees(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { guarantees: [], pagination: {} },
	});

	const getGuarantees = async () => {
		console.log(companyId);
		console.log(shipmentId);

		// const temp = await GuaranteeService.getAll(companyId, shipmentId);

		// const { data: items = [] } = await GuaranteeService.getAllGuarantNonPO(companyId, shipmentId);

		// return { guarantees: items };

		const { data: items = [] } = await GuaranteeService.getAllGuarantNonPO(companyId, shipmentId);
		console.log(items);
		return { guarantees: items };
	};

	const columns = useMemo(
		() => [
			{
				Header: 'Bank',
				accessor: 'bank',
				Cell: ({ row, value }) => (
					<Link
						underline='hover'
						color={theme.palette.mode === 'dark' ? '#FFFFFF' : '#262626'}
						onClick={() => handleGuaranteeForm(OPERATION_MODE.View, row?.original?.id)}
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
					return <GuaranteeKebabMenu row={row} handleClick={handleGuaranteeForm} />;
				},
			},
			{
				Header: 'Guarantee Type',
				accessor: 'type',
			},
			{
				Header: 'Amount',
				accessor: 'amount',
			},
			{
				Header: 'Beneficiary',
				accessor: 'beneficiary',
				Cell: ({ row, value }) => (
					<Link
						underline='hover'
						color={theme.palette.mode === 'dark' ? '#FFFFFF' : '#262626'}
						onClick={() => handleGuaranteeForm(OPERATION_MODE.View, row?.original?.id)}
						sx={{ cursor: 'pointer' }}
					>
						{value}
					</Link>
				),
			},
			{
				Header: 'Issue Date',
				accessor: 'issueDate',
				Cell: ({ value, row }) => (
					<Link
						underline='hover'
						color={theme.palette.mode === 'dark' ? '#FFFFFF' : '#262626'}
						onClick={() => handleGuaranteeForm(OPERATION_MODE.View, row?.original?.id)}
						sx={{ cursor: 'pointer' }}
					>
						{moment(value).format('yyyy-MM-DD')}
					</Link>
				),
			},
			{
				Header: 'Expiry Date',
				accessor: 'expiryDate',
				Cell: ({ value, row }) => (
					<Link
						underline='hover'
						color={theme.palette.mode === 'dark' ? '#FFFFFF' : '#262626'}
						onClick={() => handleGuaranteeForm(OPERATION_MODE.View, row?.original?.id)}
						sx={{ cursor: 'pointer' }}
					>
						{moment(value).format('yyyy-MM-DD')}
					</Link>
				),
			},
			{
				Header: 'Extended Date',
				accessor: 'extendedDate',
				Cell: ({ value, row }) => (
					<Link
						underline='hover'
						color={theme.palette.mode === 'dark' ? '#FFFFFF' : '#262626'}
						onClick={() => handleGuaranteeForm(OPERATION_MODE.View, row?.original?.id)}
						sx={{ cursor: 'pointer' }}
					>
						{moment(value).format('yyyy-MM-DD')}
					</Link>
				),
			},
			{
				Header: 'Remark',
				accessor: 'remark',
			},
			{
				Header: 'Status',
				accessor: 'status',
				Cell: ({ value }) => <Chip label={value} size='small' variant='light' color={STATUS_PROPERTIES_TABLE[value] ?? 'default'} />,
			},
		],
		[theme]
	);

	return (
		<>
			<MainCard content={false}>
				<SimpleBar>
					<ReactTable
						data={guarantees}
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

GuaranteeList.propTypes = {
	handleGuaranteeForm: PropTypes.func.isRequired,
	shipmentId: PropTypes.number.isRequired,
	row: PropTypes.shape({
		original: PropTypes.shape({
			id: PropTypes.any,
		}),
	}),
	value: PropTypes.any,
};
