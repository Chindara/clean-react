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
import PaymentTypeKebabMenu from '../../components/PaymentTypeKebabMenu';

// SERVICES
import ShipmentPaymentTypeService from 'services/ShipmentPaymentTypeService';

// CONSTANTS
import { PAGINATION_PROPERTIES, STATUS_PROPERTIES_TABLE } from 'constants/Common';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| Payment Types LIST ||============================== //\

export default function PaymentTypeList({ handlePaymentTypeForm, setReportData }) {
	const theme = useTheme();
	const { companyId } = useAuth();
	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);

	const {
		data: { paymentTypes, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['paymentType', { page, limit }],
		queryFn: () => getPaymentTypes(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { paymentTypes: [], pagination: {} },
	});

	const getPaymentTypes = async () => {
		const { data: { items = [], ...pagination } = {} } = await ShipmentPaymentTypeService.getAll(companyId, page, limit);
		return { paymentTypes: items, pagination: pagination };
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
						onClick={() => handlePaymentTypeForm(OPERATION_MODE.View, row?.original?.id)}
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
					return <PaymentTypeKebabMenu row={row} handleClick={handlePaymentTypeForm} />;
				},
			},
			{
				Header: 'Status',
				accessor: 'status',
				Cell: ({ value }) => <Chip label={value} size='small' variant='light' color={STATUS_PROPERTIES_TABLE[value] ?? 'default'} />,
			},
		],
		[theme, handlePaymentTypeForm]
	);

	useEffect(() => {
		setReportData(paymentTypes);
	}, [isFetching]);

	return (
		<>
			<SimpleBar>
				<ReactTable
					data={paymentTypes}
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
PaymentTypeList.propTypes = {
	handlePaymentTypeForm: PropTypes.func.isRequired,
	setReportData: PropTypes.func.isRequired,
	row: PropTypes.shape({
		original: PropTypes.shape({
			id: PropTypes.any,
		}),
	}),
	value: PropTypes.any,
};
