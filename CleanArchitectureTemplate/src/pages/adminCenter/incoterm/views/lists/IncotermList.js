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
import IncotermKebabMenu from '../../components/IncoKebabMenu';

// SERVICES
import IncotermService from 'services/IncotermService';

// CONSTANTS
import { PAGINATION_PROPERTIES, STATUS_PROPERTIES_TABLE } from 'constants/Common';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| COMPANY LIST ||============================== //\

export default function IncotermList({ handleIncotermForm }) {
	const theme = useTheme();
    const { companyId } = useAuth();
	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);

	const {
		data: { incoterms, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['incoterm', { page, limit }],
		queryFn: () => getIncoterms(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { incoterms: [], pagination: {} },
	});

	const getIncoterms = async () => {
		const { data: { items = [], ...pagination } = {} } = await IncotermService.getAll(companyId, page, limit);
		return { incoterms: items, pagination: pagination };
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
						onClick={() => handleIncotermForm(OPERATION_MODE.View, row?.original?.id)}
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
					return <IncotermKebabMenu row={row} handleClick={handleIncotermForm} />;
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
		[theme, handleIncotermForm]
	);

	return (
		<>
				<SimpleBar>
					<ReactTable
						data={incoterms}
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
IncotermList.propTypes = {
	handleIncotermForm: PropTypes.func.isRequired,
	row: PropTypes.shape({
		original: PropTypes.shape({
			id: PropTypes.any,
		}),
	}),
	value: PropTypes.any,
};
