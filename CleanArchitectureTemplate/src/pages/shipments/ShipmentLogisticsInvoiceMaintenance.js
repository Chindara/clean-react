import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import breadcrumbItems from 'containers/menu-items/breadcrumbs';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// MUI
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Grid, Stack, TextField, FormControl, InputLabel, Card, CardContent, Box } from '@mui/material';

// ASSETS
import { FaArrowAltCircleLeft } from 'react-icons/fa';

// PROJECT IMPORT
import ShipmentList from './views/lists/ShipmentLogisticsInvoiceList';
import LogisticsInvoice from './views/features/ShipmentLogisticsInvoice';

// CONTEXTS
import { ShipmentProvider, useShipment } from './contexts/ShipmentsContext';

// CONSTANTS
import { SHIPMENT_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import IconButton from 'components/@extended/IconButton';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { setAlertError } from 'components/alert/Alert';
import PurchaseOrderService from 'services/PurchaseOrderService';
import ShipmentService from 'services/ShipmentService';
import useAuth from 'hooks/useAuth';
import ShipmentLogisticsInvoiceService from 'services/ShipmentLogisticsInvoiceService';
import { CONTROL_SIZE } from 'constants/Common';
import MainCard from 'components/MainCard';
import { formatMoney } from 'utils/formatMoney';
import navigation from 'containers/menu-items';

const ShipmentLogisticsInvoiceMaintenance = () => {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const [searchParams, setSearchParams] = useSearchParams();
	const [shipment, setShipment] = useState({
		id: Number(searchParams.get('id')),
	});
	const [purchaseOrderResult, setPurchaseOrderResult] = useState([]);
	const [logisticsInvoiceResult, setLogisticsInvoiceResult] = useState([]);

	const {
		data: { currentShipment, poNumbers },
		isFetching,
	} = useQuery({
		queryKey: ['shipmentLogisticsInvoice1'],
		queryFn: () => getShipmentById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentShipment: {}, poNumbers: '' },
		enabled: !!shipment?.id,
		onError: () => setAlertError(SHIPMENT_ALERT.Error.GetShipment),
	});

	const getShipmentById = async () => {
		const { data: { record = {} } = {} } = await ShipmentService.getById(companyId, shipment?.id);

		const promises = record.purchaseOrders.map((poId) => PurchaseOrderService.getById(companyId, poId));
		const purchaseOrders = await Promise.all(promises); //execute
		const poNumbers = purchaseOrders.map((po) => po?.data?.record?.poNo.trim() || 'N/A').join(', ');

		const items = await ShipmentLogisticsInvoiceService.getAll(companyId, shipment?.id);
		setLogisticsInvoiceResult(items?.data);

		return { currentShipment: record, poNumbers };
	};

	useEffect(() => {
		setShipment({ ...shipment, ...currentShipment });
	}, [currentShipment]);

	const theme = useTheme();
	const navigate = useNavigate();
	const [openPanel, setOpenPanel] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedLogisticsInvoice, setSelectedLogisticsInvoice] = useState({ mode: null, id: null });

	const handleLogisticsInvoiceForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.View:
				setSelectedLogisticsInvoice({ mode: OPERATION_MODE.View, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Edit:
				setSelectedLogisticsInvoice({ mode: OPERATION_MODE.Edit, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Delete:
				setSelectedLogisticsInvoice({ mode: OPERATION_MODE.Delete, id: record });
				setOpenDeleteModal(true);
				break;

			default:
				setSelectedLogisticsInvoice({ mode: OPERATION_MODE.Create, id: null });
				setOpenPanel(true);
				break;
		}
	};

	// const calculateTotalAmounts = () => {
	// 	// Filter LogisticsInvoices based on type
	// 	const advanceLogisticsInvoices = LogisticsInvoiceResult.filter((item) => item.type === 'Advance');
	// 	const finalLogisticsInvoices = LogisticsInvoiceResult.filter((item) => item.type === 'Final');
	// 	const depositLogisticsInvoices = LogisticsInvoiceResult.filter((item) => item.type === 'Deposit');

	// 	// Calculate total amounts for each type
	// 	const advanceTotal = advanceLogisticsInvoices.reduce((total, item) => total + item.amount, 0);
	// 	const finalTotal = finalLogisticsInvoices.reduce((total, item) => total + item.amount, 0);
	// 	const depositTotal = depositLogisticsInvoices.reduce((total, item) => total + item.amount, 0);
	// 	const LogisticsInvoiceTotal = finalTotal + depositTotal;

	// 	return { advanceTotal, LogisticsInvoiceTotal };
	// };

	// const { advanceTotal, LogisticsInvoiceTotal } = calculateTotalAmounts();

	return (
		<>
			<Stack spacing={2}>
				<Stack direction='row' alignItems='flex-start' justifyContent='space-between'>
					<Breadcrumbs navigation={breadcrumbItems} />
					<Stack direction='row' alignItems='center' justifyContent='flex-start' spacing={1}>
						<Button variant='contained' color='primary' onClick={handleLogisticsInvoiceForm} mb={2}>
							New Logistics Invoices
						</Button>

						<IconButton aria-label='back' onClick={() => navigate(`..`)}>
							<FaArrowAltCircleLeft style={{ fontSize: '1.2rem' }} />
						</IconButton>
					</Stack>
				</Stack>
			</Stack>

			<Grid container spacing={2} mb={2} direction='row' justifyContent='flex-end' alignItems='flex-start'>
				<Grid item xs={12} sm={6}>
					<Card variant='outlined'>
						<CardContent>
							<Grid container spacing={2}>
								<Grid item sm={8}>
									<Stack spacing={0.5}>
										<h6>Purchase Order No</h6>
										<h2>{poNumbers || ''}</h2>
									</Stack>
								</Grid>
								<Grid item sm={3}>
									<Stack spacing={0.5}>
										<h6>Reference No</h6>
										<h2>{shipment?.referenceNo || ''}</h2>
									</Stack>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Grid>
				{/* <Grid item xs={12} sm={4}>
					<Card variant='outlined'>
						<CardContent>
							<Grid container spacing={2}>
								<Grid item sm={6}>
									<Stack spacing={0.5}>
										<h6>LogisticsInvoice Total</h6>
										<h2>{formatMoney(null, LogisticsInvoiceTotal)}</h2>
									</Stack>
								</Grid>
								<Grid item sm={6}>
									<Stack spacing={0.5}>
										<h6>Advance Total</h6>
										<h2>{formatMoney(null, advanceTotal)}</h2>
									</Stack>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Grid> */}
			</Grid>

			<MainCard>
				<ShipmentList handleLogisticsInvoiceForm={handleLogisticsInvoiceForm} shipmentId={shipment?.id} />
			</MainCard>

			<ShipmentProvider>
				<LogisticsInvoice
					openPanel={openPanel}
					setOpenPanel={setOpenPanel}
					openDeleteModal={openDeleteModal}
					setOpenDeleteModal={setOpenDeleteModal}
					selectedLogisticsInvoice={selectedLogisticsInvoice}
					setSelectedLogisticsInvoice={setSelectedLogisticsInvoice}
					shipment={shipment}
				/>
			</ShipmentProvider>
		</>
	);
};

export default ShipmentLogisticsInvoiceMaintenance;
