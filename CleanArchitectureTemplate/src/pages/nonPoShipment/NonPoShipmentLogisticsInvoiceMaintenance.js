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
import LogisticsList from './views/lists/ShipmentLogisticsInvoiceList';
import LogisticsInvoice from './views/features/ShipmentLogisticsInvoice';

// CONTEXTS
import { NonPoShipmentProvider } from './contexts/NonPoShipmentContext';

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
import NonPOShipmentService from 'services/NonPoShipmentService';

const NonPoShipmentLogisticsInvoiceMaintenance = () => {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const [searchParams, setSearchParams] = useSearchParams();
	const [NonPoshipment, setNonPoShipment] = useState({
		id: Number(searchParams.get('id')),
	});
	const [purchaseOrderResult, setPurchaseOrderResult] = useState([]);
	const [logisticsInvoiceResult, setLogisticsInvoiceResult] = useState([]);

	const {
		data: { currentLogistics, shipmentReferenceNo, poNumber },
		isFetching,
	} = useQuery({
		queryKey: ['shipmentLogisticsInvoice1'],
		queryFn: () => getnonPoShipments(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentLogistics: {}, shipmentReferenceNo: '', poNumber: '' },
		enabled: !!NonPoshipment?.id,
		onError: () => setAlertError(SHIPMENT_ALERT.Error.GetShipment),
	});

	const getnonPoShipments = async () => {
		const { data: { record = {} } = {} } = await NonPOShipmentService.getNonPoById(companyId, NonPoshipment?.id);

		// Assuming record is an object and you want to extract shipmentReferenceNo
		const shipmentReferenceNo = record.shipmentReferenceNo?.trim() || 'N/A';
		console.log(shipmentReferenceNo);

		const poNumber = record.poNumber?.trim() || 'N/A';
		console.log(poNumber);

		return { currentLogistics: record, shipmentReferenceNo, poNumber };
	};

	useEffect(() => {
		setNonPoShipment({ ...NonPoshipment, ...currentLogistics });
	}, [currentLogistics]);

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
										<h2>{poNumber || ''}</h2>
									</Stack>
								</Grid>
								<Grid item sm={3}>
									<Stack spacing={0.5}>
										<h6>Reference No</h6>
										<h2>{shipmentReferenceNo || ''}</h2>
									</Stack>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			<MainCard>
				<LogisticsList handleLogisticsInvoiceForm={handleLogisticsInvoiceForm} shipmentId={NonPoshipment?.id} />
			</MainCard>

			<NonPoShipmentProvider>
				<LogisticsInvoice
					openPanel={openPanel}
					setOpenPanel={setOpenPanel}
					openDeleteModal={openDeleteModal}
					setOpenDeleteModal={setOpenDeleteModal}
					selectedLogisticsInvoice={selectedLogisticsInvoice}
					setSelectedLogisticsInvoice={setSelectedLogisticsInvoice}
					shipment={NonPoshipment}
				/>
			</NonPoShipmentProvider>
		</>
	);
};

export default NonPoShipmentLogisticsInvoiceMaintenance;
