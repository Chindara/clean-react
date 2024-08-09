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
import NatureOfPurchaseKebabMenu from '../../components/NatureOfPurchaseKebabMenu';

// SERVICES
import NatureOfPurchaseService from 'services/NatureOfPurchaseService';

// CONSTANTS
import { PAGINATION_PROPERTIES, STATUS_PROPERTIES_TABLE } from 'constants/Common';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';
import natureOfPurchaseService from 'services/NatureOfPurchaseService';

// ==============================|| NatureOfPurchase LIST ||============================== //\

export default function NatureOfPurchaseList({ handleNatureOfPurchaseForm, setReportData }) {
	const theme = useTheme();
	const { companyId } = useAuth();
	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);

	const {
		data: { natureOfPurchases, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['natureOfPurchase', { page, limit }],
		queryFn: () => getNatureOfPurchases(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { natureOfPurchases: [], pagination: {} },
	});

	const getNatureOfPurchases = async () => {
		const { data: { items = [], ...pagination } = {} } = await NatureOfPurchaseService.getAll(companyId, page, limit);
		return { natureOfPurchases: items, pagination: pagination };
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
						onClick={() => handleNatureOfPurchaseForm(OPERATION_MODE.View, row?.original?.id)}
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
					return <NatureOfPurchaseKebabMenu row={row} handleClick={handleNatureOfPurchaseForm} />;
				},
			},
			{
				Header: 'Status',
				accessor: 'status',
				Cell: ({ value }) => <Chip label={value} size='small' variant='light' color={STATUS_PROPERTIES_TABLE[value] ?? 'default'} />,
			},
		],
		[theme, handleNatureOfPurchaseForm]
	);

	useEffect(() => {
		setReportData(natureOfPurchases);
	}, [isFetching]);

	return (
		<>
			<SimpleBar>
				<ReactTable
					data={natureOfPurchases}
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
NatureOfPurchaseList.propTypes = {
	handleNatureOfPurchaseForm: PropTypes.func.isRequired,
	setReportData: PropTypes.func.isRequired,
	row: PropTypes.shape({
		original: PropTypes.shape({
			id: PropTypes.any,
		}),
	}),
	value: PropTypes.any,
};
