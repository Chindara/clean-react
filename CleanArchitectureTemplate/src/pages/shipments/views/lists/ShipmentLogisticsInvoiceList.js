import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// MUI
import { useTheme } from '@mui/material/styles';
import { Link, Chip, InputLabel } from '@mui/material';

// THIRD-PARTY
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';

// PROJECT IMPORT
import ReactTable from 'components/ui/ReactTable';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import LogisticsInvoiceKebabMenu from '../../components/ShipmentsLogisticsInvoiceKebabMenu';

// SERVICES
import ShipmentLogisticsInvoiceService from 'services/ShipmentLogisticsInvoiceService';

// CONSTANTS
import { PAGINATION_PROPERTIES, SHIPMENT_STATUS_COLOR } from 'constants/Common';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| SHIPMENT LogisticsInvoice TYPE LIST ||============================== //\

export default function ShipmentList({ handleLogisticsInvoiceForm, shipmentId }) {
	const theme = useTheme();
	const navigate = useNavigate();
	const { userId, companyId } = useAuth();

	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);

	const {
		data: { logisticsInvoices, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['shipmentLogisticsInvoice'],
		queryFn: () => getLogisticsInvoices(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { logisticsInvoices: [], pagination: {} },
	});

	const getLogisticsInvoices = async () => {
		const { data: items = [] } = await ShipmentLogisticsInvoiceService.getAll(companyId, shipmentId);
		return { logisticsInvoices: items };
	};

	const columns = useMemo(
		() => [
			{
				Header: 'Category',
				accessor: 'category',
			},
			{
				id: 'actions-column',
				className: 'cell-center',
				disableSortBy: true,
				Cell: ({ row }) => {
					return <LogisticsInvoiceKebabMenu row={row} handleClick={handleLogisticsInvoiceForm} />;
				},
			},
			{
				Header: 'Type',
				accessor: 'type',
			},
			{
				Header: 'Amount',
				accessor: 'amount',
				Cell: ({ row }) => (
					<InputLabel style={{ float: 'left' }}>
						{Number(row.original.amount).toLocaleString('en-US', {
							style: 'decimal',
							maximumFractionDigits: 2,
							minimumFractionDigits: 2,
						})}
					</InputLabel>
				),
			},
			{
				Header: 'Beneficiary',
				accessor: 'beneficiary',
			},
			{
				Header: 'Submitted to Finance',
				accessor: 'paymentSubmittedDate',
				Cell: ({ value }) => <InputLabel style={{ textAlign: 'center' }}>{value === null ? '' : moment(value).format('yyyy-MM-DD')}</InputLabel>,
			},
			{
				Header: 'Payment Due Date',
				accessor: 'paymentDueDate',
				Cell: ({ value }) => <InputLabel style={{ textAlign: 'center' }}>{moment(value).format('yyyy-MM-DD')}</InputLabel>,
			},
			{
				Header: 'Payment Date',
				accessor: 'paymentDate',
				Cell: ({ value }) => <InputLabel style={{ textAlign: 'center' }}>{moment(value).format('yyyy-MM-DD')}</InputLabel>,
			},
			{
				Header: 'Payment Reference',
				accessor: 'paymentReference',
			},
			{
				Header: 'Container No',
				accessor: 'containerNo',
			},
			{
				Header: 'Invoice Received Date',
				accessor: 'invoiceReceivedDate',
				Cell: ({ value }) => <InputLabel style={{ textAlign: 'center' }}>{value === null ? '' : moment(value).format('yyyy-MM-DD')}</InputLabel>,
			},
			{
				Header: 'Invoice Date',
				accessor: 'invoiceDate',
				Cell: ({ value }) => <InputLabel style={{ textAlign: 'center' }}>{value === null ? '' : moment(value).format('yyyy-MM-DD')}</InputLabel>,
			},
		],
		[theme]
	);

	return (
		<>
			<MainCard content={false}>
				<SimpleBar>
					<ReactTable
						data={logisticsInvoices}
						columns={columns}
						//paginate={true}
						//pagination={pagination}
						//page={page}
						//limit={limit}
						//setPage={setPage}
						//setLimit={setLimit}
						isFetching={isFetching}
					/>
				</SimpleBar>
			</MainCard>
		</>
	);
}

ShipmentList.propTypes = {
	handleLogisticsInvoiceForm: PropTypes.func.isRequired,
	shipmentId: PropTypes.number.isRequired,
	row: PropTypes.shape({
		original: PropTypes.shape({
			id: PropTypes.any,
			amount: PropTypes.number,
		}),
	}),
	value: PropTypes.any,
};
