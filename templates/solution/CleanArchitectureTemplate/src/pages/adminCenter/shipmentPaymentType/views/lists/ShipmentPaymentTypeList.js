import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

// MUI
import { useTheme } from '@mui/material/styles';
import { Link, Chip } from '@mui/material';

// THIRD-PARTY
import { useQuery } from '@tanstack/react-query';

// PROJECT IMPORT
import ReactTable from 'components/ui/ReactTable';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import ShipmentPaymentTypeKebabMenu from '../../components/ShipmentPaymentTypeKebabMenu';

// SERVICES

// CONSTANTS
import { PAGINATION_PROPERTIES, STATUS_PROPERTIES_TABLE } from 'constants/Common';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';
import ShipmentPaymentTypeService from 'services/ShipmentPaymentTypeService';

// ==============================|| ShipmentPaymentType LIST ||============================== //\

export default function ShipmentPaymentTypeList({ handleShipmentPaymentTypeForm }) {
	const theme = useTheme();
	const { companyId } = useAuth();
	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);

	const {
		data: { shipmentPaymentTypes, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['shipmentPaymentType', { page, limit }],
		queryFn: () => getShipmentPaymentTypes(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { shipmentPaymentTypes: [], pagination: {} },
	});

	const getShipmentPaymentTypes = async () => {
		const { data: { items = [], ...pagination } = {} } = await ShipmentPaymentTypeService.getAll(companyId, page, limit);
		return { shipmentPaymentTypes: items, pagination: pagination };
	};

	const columns = useMemo(
		() => [
			{
				Header: 'Name',
				accessor: 'name',
				Cell: ({ row, value }) => (
					<Link
						underline='hover'
						color={theme.palette.mode === 'dark' ? '#FFFFFF' : '#262626'}
						onClick={() => handleShipmentPaymentTypeForm(OPERATION_MODE.View, row?.original?.id)}
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
					return <ShipmentPaymentTypeKebabMenu row={row} handleClick={handleShipmentPaymentTypeForm} />;
				},
			},
			{
				Header: 'Status',
				accessor: 'status',
				Cell: ({ value }) => <Chip label={value} size='small' variant='light' color={STATUS_PROPERTIES_TABLE[value] ?? 'default'} />,
			},
		],
		[theme, handleShipmentPaymentTypeForm]
	);

	return (
		<>
			<SimpleBar>
				<ReactTable
					data={shipmentPaymentTypes}
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
ShipmentPaymentTypeList.propTypes = {
	handleShipmentPaymentTypeForm: PropTypes.func.isRequired,
	row: PropTypes.shape({
		original: PropTypes.shape({
			id: PropTypes.any,
		}),
	}),
	value: PropTypes.any,
};
