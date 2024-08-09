import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

// MUI
import { useTheme } from '@mui/material/styles';
import { Link, Chip } from '@mui/material';

// THIRD-PARTY
import { useQuery } from '@tanstack/react-query';

// PROJECT IMPORT
import ReactTable from 'components/ui/ReactTable';
import SimpleBar from 'components/third-party/SimpleBar';
import ClearingAgentKebabMenu from '../../components/ClearingAgentKebabMenu';

// SERVICES

// CONSTANTS
import { PAGINATION_PROPERTIES, STATUS_PROPERTIES_TABLE } from 'constants/Common';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';
import ClearingAgentService from 'services/ClearingAgentService';

// ==============================|| ClearingAgent LIST ||============================== //\

export default function ClearingAgentList({ handleClearingAgentForm }) {
	const theme = useTheme();
	const { companyId } = useAuth();
	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);

	const {
		data: { clearingAgents, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['clearingAgent', { page, limit }],
		queryFn: () => getClearingAgents(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { clearingAgents: [], pagination: {} },
	});

	const getClearingAgents = async () => {
		const { data: { items = [], ...pagination } = {} } = await ClearingAgentService.getAll(companyId, page, limit);
		return { clearingAgents: items, pagination: pagination };
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
						onClick={() => handleClearingAgentForm(OPERATION_MODE.View, row?.original?.id)}
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
					return <ClearingAgentKebabMenu row={row} handleClick={handleClearingAgentForm} />;
				},
			},
			{
				Header: 'Status',
				accessor: 'status',
				Cell: ({ value }) => <Chip label={value} size='small' variant='light' color={STATUS_PROPERTIES_TABLE[value] ?? 'default'} />,
			},
		],
		[theme, handleClearingAgentForm]
	);

	return (
		<>
			<SimpleBar>
				<ReactTable
					data={clearingAgents}
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
ClearingAgentList.propTypes = {
	handleClearingAgentForm: PropTypes.func.isRequired,
	row: PropTypes.shape({
		original: PropTypes.shape({
			id: PropTypes.any,
		}),
	}),
	value: PropTypes.any,
};
