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
import VendorKebabMenu from '../../components/VendorKebabMenu';

// SERVICES
import VendorService from 'services/VendorService';

// CONSTANTS
import { PAGINATION_PROPERTIES, STATUS_PROPERTIES_TABLE } from 'constants/Common';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| VENDOR LIST ||============================== //\

export default function VendorList({ handleVendorForm }) {
	const theme = useTheme();
	const { companyId } = useAuth();
	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);

	const {
		data: { vendors, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['vendor', { page, limit }],
		queryFn: () => getVendors(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { vendors: [], pagination: {} },
	});

	const getVendors = async () => {
		const { data: { items = [], ...pagination } = {} } = await VendorService.getAll(companyId, page, limit);
		return { vendors: items, pagination: pagination };
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
						onClick={() => handleVendorForm(OPERATION_MODE.View, row?.original?.id)}
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
					return <VendorKebabMenu row={row} handleClick={handleVendorForm} />;
				},
			},
			{
				Header: 'Status',
				accessor: 'status',
				Cell: ({ value }) => (
					<Chip
						label={value}
						size='small'
						variant='light'
						color={STATUS_PROPERTIES_TABLE[value] ?? 'default'}
					/>
				),
			},
		],
		[theme, handleVendorForm]
	);

	return (
		<>
				<SimpleBar>
					<ReactTable
						data={vendors}
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

VendorList.propTypes = {
	handleVendorForm: PropTypes.func.isRequired,
	row: PropTypes.shape({
		original: PropTypes.shape({
			id: PropTypes.any,
		}),
	}),
	value: PropTypes.any,
};
