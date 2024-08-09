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
import ShipmentCostCategoryKebabMenu from '../../components/ShipmentCostCategoryKebabMenu';

// SERVICES

// CONSTANTS
import { PAGINATION_PROPERTIES, STATUS_PROPERTIES_TABLE } from 'constants/Common';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';
import ShipmentCostCategoryService from 'services/ShipmentCostCategoryService';

// ==============================|| ShipmentCategory LIST ||============================== //\

export default function ShipmentCostCategoryList({ handleShipmentCostCategoryForm }) {
	const theme = useTheme();
	const { companyId } = useAuth();
	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);

	const {
		data: { shipmentCostCategories, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['shipmentCostCategories', { page, limit }],
		queryFn: () => getShipmentCostCategories(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { shipmentCategories: [], pagination: {} },
	});

	const getShipmentCostCategories = async () => {
		const { data: { items = [], ...pagination } = {} } = await ShipmentCostCategoryService.getAll(companyId, page, limit);
		return { shipmentCostCategories: items, pagination: pagination };
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
						onClick={() => handleShipmentCostCategoryForm(OPERATION_MODE.View, row?.original?.id)}
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
					return <ShipmentCostCategoryKebabMenu row={row} handleClick={handleShipmentCostCategoryForm} />;
				},
			},
			{
				Header: 'Status',
				accessor: 'status',
				Cell: ({ value }) => <Chip label={value} size='small' variant='light' color={STATUS_PROPERTIES_TABLE[value] ?? 'default'} />,
			},
		],
		[theme, handleShipmentCostCategoryForm]
	);

	return (
		<>
			<SimpleBar>
				<ReactTable
					data={shipmentCostCategories}
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
ShipmentCostCategoryList.propTypes = {
	handleShipmentCostCategoryForm: PropTypes.func.isRequired,
	row: PropTypes.shape({
		original: PropTypes.shape({
			id: PropTypes.any,
		}),
	}),
	value: PropTypes.any,
};
