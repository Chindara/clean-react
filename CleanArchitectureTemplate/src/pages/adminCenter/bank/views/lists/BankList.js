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
import BankKebabMenu from '../../components/BankKebabMenu';

// SERVICES
import BankService from 'services/BankService';

// CONSTANTS
import { PAGINATION_PROPERTIES, STATUS_PROPERTIES_TABLE } from 'constants/Common';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| Bank LIST ||============================== //\

export default function BankList({ handleBankForm, setReportData }) {
	const theme = useTheme();
	const { companyId } = useAuth();
	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);

	const {
		data: { banks, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['bank', { page, limit }],
		queryFn: () => getBanks(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { banks: [], pagination: {} },
	});

	const getBanks = async () => {
		const { data: { items = [], ...pagination } = {} } = await BankService.getAll(companyId, page, limit);
		return { banks: items, pagination: pagination };
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
						onClick={() => handleBankForm(OPERATION_MODE.View, row?.original?.id)}
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
					return <BankKebabMenu row={row} handleClick={handleBankForm} />;
				},
			},
			{
				Header: 'Status',
				accessor: 'status',
				Cell: ({ value }) => <Chip label={value} size='small' variant='light' color={STATUS_PROPERTIES_TABLE[value] ?? 'default'} />,
			},
		],
		[theme, handleBankForm]
	);

	useEffect(() => {
		setReportData(banks);
	}, [isFetching]);

	return (
		<>
			<SimpleBar>
				<ReactTable
					data={banks}
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
BankList.propTypes = {
	handleBankForm: PropTypes.func.isRequired,
	setReportData: PropTypes.func.isRequired,
	row: PropTypes.shape({
		original: PropTypes.shape({
			id: PropTypes.any,
		}),
	}),
	value: PropTypes.any,
};
