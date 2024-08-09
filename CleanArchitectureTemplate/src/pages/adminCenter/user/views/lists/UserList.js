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
import UserKebabMenu from '../../components/UserKebabMenu';

// SERVICES
import UserService from 'services/UserService';

// CONSTANTS
import { PAGINATION_PROPERTIES, STATUS_PROPERTIES_TABLE, USER_TYPE_PROPERTIES_TABLE } from 'constants/Common';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| COMPANY LIST ||============================== //\

export default function UserList({ handleUserForm }) {
	const theme = useTheme();
	const { companyId } = useAuth();
	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);

	const {
		data: { users, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['user', { page, limit }],
		queryFn: () => getUsers(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { users: [], pagination: {} },
	});

	const getUsers = async () => {
		const { data: { items = [], ...pagination } = {} } = await UserService.getAll(companyId, page, limit);
		return { users: items, pagination: pagination };
	};

	const columns = useMemo(
		() => [
			{
				Header: 'First Name',
				accessor: 'firstName',
				Cell: ({ row, value }) => (
					<Link
						underline='hover'
						color={theme.palette.mode === 'dark' ? '#FFFFFF' : '#262626'}
						onClick={() => handleUserForm(OPERATION_MODE.View, row?.original?.id)}
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
					return <UserKebabMenu row={row} handleClick={handleUserForm} />;
				},
			},
			{
				Header: 'Last Name',
				accessor: 'lastName',
				Cell: ({ row, value }) => (
					<Link
						underline='hover'
						color={theme.palette.mode === 'dark' ? '#FFFFFF' : '#262626'}
						onClick={() => handleUserForm(OPERATION_MODE.View, row?.original?.id)}
						sx={{ cursor: 'pointer' }}
					>
						{value}
					</Link>
				),
			},
			{
				Header: 'Email',
				accessor: 'email',
			},
			{
				Header: 'Mobile Number',
				accessor: 'mobile',
			},
			{
				Header: 'Type',
				accessor: 'userType',
				Cell: ({ value }) => <Chip label={value} size='small' variant='light' color={USER_TYPE_PROPERTIES_TABLE[value] ?? 'default'} />,
			},
			{
				Header: 'Status',
				accessor: 'status',
				Cell: ({ value }) => <Chip label={value} size='small' variant='light' color={STATUS_PROPERTIES_TABLE[value] ?? 'default'} />,
			},
		],
		[theme, handleUserForm]
	);

	return (
		<>
				<SimpleBar>
					<ReactTable
						data={users}
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

UserList.propTypes = {
	handleUserForm: PropTypes.func.isRequired,
	row: PropTypes.shape({
		original: PropTypes.shape({
			id: PropTypes.any,
		}),
	}),
	value: PropTypes.any,
};
