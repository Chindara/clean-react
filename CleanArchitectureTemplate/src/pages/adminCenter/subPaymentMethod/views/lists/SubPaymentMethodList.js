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
import SubPaymentMethodKebabMenu from '../../components/SubPaymentMethodKebabMenu';

// SERVICES
import SubPaymentMethodService from 'services/SubPaymentMethodService';

// CONSTANTS
import { PAGINATION_PROPERTIES, STATUS_PROPERTIES_TABLE } from 'constants/Common';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| COMPANY LIST ||============================== //\

export default function SubPaymentMethodList({ handleSubPaymentMethodForm }) {
	const theme = useTheme();
    const { companyId } = useAuth();
	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);

	const {
		data: { subPaymentMethods, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['subPaymentMethod', { page, limit }],
		queryFn: () => getSubPaymentMethods(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { subPaymentMethods: [], pagination: {} },
	});

	const getSubPaymentMethods = async () => {
		console.log(companyId)

		const { data: { items = [], ...pagination } = {} } = await SubPaymentMethodService.getAll(companyId, page, limit);
		return { subPaymentMethods: items, pagination: pagination };
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
						onClick={() => handleSubPaymentMethodForm(OPERATION_MODE.View, row?.original?.id)}
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
					return <SubPaymentMethodKebabMenu row={row} handleClick={handleSubPaymentMethodForm} />;
				},
			},
			{
				Header: 'Type',
				accessor: 'type',
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
		[theme, handleSubPaymentMethodForm]
	);

	return (
		<>
				<SimpleBar>
					<ReactTable
						data={subPaymentMethods}
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
SubPaymentMethodList.propTypes = {
	handleSubPaymentMethodForm: PropTypes.func.isRequired,
	row: PropTypes.shape({
		original: PropTypes.shape({
			id: PropTypes.any,
		}),
	}),
	value: PropTypes.any,
};
