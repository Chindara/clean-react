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
import BeneficiaryKebabMenu from '../../components/BeneficiaryKebabMenu';

// SERVICES
import BeneficiaryService from 'services/BeneficiaryService';

// CONSTANTS
import { PAGINATION_PROPERTIES, STATUS_PROPERTIES_TABLE } from 'constants/Common';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| Beneficiary LIST ||============================== //\

export default function BeneficiaryList({ handleBeneficiaryForm, setReportData }) {
	const theme = useTheme();
	const { companyId } = useAuth();
	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);

	const {
		data: { beneficiaries, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['beneficiary', { page, limit }],
		queryFn: () => getBeneficiaries(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { beneficiaries: [], pagination: {} },
	});

	const getBeneficiaries = async () => {
		const { data: { items = [], ...pagination } = {} } = await BeneficiaryService.getAll(companyId, page, limit);
		return { beneficiaries: items, pagination: pagination };
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
						onClick={() => handleBeneficiaryForm(OPERATION_MODE.View, row?.original?.id)}
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
					return <BeneficiaryKebabMenu row={row} handleClick={handleBeneficiaryForm} />;
				},
			},
			{
				Header: 'Status',
				accessor: 'status',
				Cell: ({ value }) => <Chip label={value} size='small' variant='light' color={STATUS_PROPERTIES_TABLE[value] ?? 'default'} />,
			},
		],
		[theme, handleBeneficiaryForm]
	);

	useEffect(() => {
		setReportData(beneficiaries);
	}, [isFetching]);

	return (
		<>
			<SimpleBar>
				<ReactTable
					data={beneficiaries}
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
BeneficiaryList.propTypes = {
	handleBeneficiaryForm: PropTypes.func.isRequired,
	setReportData: PropTypes.func.isRequired,
	row: PropTypes.shape({
		original: PropTypes.shape({
			id: PropTypes.any,
		}),
	}),
	value: PropTypes.any,
};
