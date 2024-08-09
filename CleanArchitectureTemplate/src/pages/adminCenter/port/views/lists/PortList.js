import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

// MUI
import { useTheme } from '@mui/material/styles';
import { Link, Chip } from '@mui/material';

// THIRD-PARTY
import { useQuery } from '@tanstack/react-query';

// PROJECT IMPORT
import ReactTable from 'components/ui/ReactTable';
import SimpleBar from 'components/third-party/SimpleBar';
import PortKebabMenu from '../../components/PortKebabMenu';

// SERVICES
import PortService from 'services/PortService';

// CONSTANTS
import { PAGINATION_PROPERTIES, STATUS_PROPERTIES_TABLE } from 'constants/Common';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| Port LIST ||============================== //\

export default function PortList({ handlePortForm, setReportData }) {
	const theme = useTheme();
	const { companyId } = useAuth();
	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);

	const {
		data: { ports, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['port', { page, limit }],
		queryFn: () => getPorts(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { ports: [], pagination: {} },
	});

	const getPorts = async () => {
		const { data: { items = [], ...pagination } = {} } = await PortService.getAll(companyId, page, limit);
		return { ports: items, pagination: pagination };
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
						onClick={() => handlePortForm(OPERATION_MODE.View, row?.original?.id)}
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
					return <PortKebabMenu row={row} handleClick={handlePortForm} />;
				},
			},
			{
				Header: 'Status',
				accessor: 'status',
				Cell: ({ value }) => <Chip label={value} size='small' variant='light' color={STATUS_PROPERTIES_TABLE[value] ?? 'default'} />,
			},
		],
		[theme, handlePortForm]
	);

	useEffect(() => {
		setReportData(ports);
	}, [isFetching]);

	return (
		<>
			<SimpleBar>
				<ReactTable
					data={ports}
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
PortList.propTypes = {
	handlePortForm: PropTypes.func.isRequired,
	setReportData: PropTypes.func.isRequired,
	row: PropTypes.shape({
		original: PropTypes.shape({
			id: PropTypes.any,
		}),
	}),
	value: PropTypes.any,
};
