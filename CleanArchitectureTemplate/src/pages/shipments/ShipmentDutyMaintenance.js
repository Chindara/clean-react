import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';

// MUI
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Grid, Stack, TextField, FormControl, InputLabel, Card, CardContent } from '@mui/material';

// ASSETS
import PaidIcon from '@mui/icons-material/Paid';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import breadcrumbItems from 'containers/menu-items/breadcrumbs';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// PROJECT IMPORT
import Duty from './views/features/ShipmentDuty';
import DutyList from './views/lists/ShipmentDutyList';
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
import MainCard from 'components/MainCard';
import navigation from 'containers/menu-items';

const ShipmentDutyMaintenance = () => {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const [searchParams, setSearchParams] = useSearchParams();
	const [shipment, setShipment] = useState({
		id: Number(searchParams.get('id')),
	});

	const {
		data: { currentShipment, poNumbers },
		isFetching,
	} = useQuery({
		queryKey: ['shipmentDuty'],
		queryFn: () => getShipmentById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentShipment: {}, poNumbers: '' },
		enabled: !!shipment?.id,
		onError: () => setAlertError(SHIPMENT_ALERT.Error.GetShipment),
	});

	const getShipmentById = async () => {
		const { data: { record = {} } = {} } = await ShipmentService.getById(companyId, shipment?.id);
		console.log(record);

		const promises = record.purchaseOrders.map((poId) => PurchaseOrderService.getById(companyId, poId));
		const purchaseOrders = await Promise.all(promises); //execute
		console.log(purchaseOrders);

		const poNumbers = purchaseOrders.map((po) => po?.data?.record?.poNo.trim() || 'N/A').join(', ');
		console.log(poNumbers);

		return { currentShipment: record, poNumbers };
	};

	useEffect(() => {
		setShipment({ ...shipment, ...currentShipment });
	}, [currentShipment]);

	const theme = useTheme();
	const navigate = useNavigate();
	const [openPanel, setOpenPanel] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedDuty, setSelectedDuty] = useState({ mode: null, id: null });

	const handleDutyForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.View:
				setSelectedDuty({ mode: OPERATION_MODE.View, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Edit:
				setSelectedDuty({ mode: OPERATION_MODE.Edit, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Delete:
				setSelectedDuty({ mode: OPERATION_MODE.Delete, id: record });
				setOpenDeleteModal(true);
				break;

			default:
				setSelectedDuty({ mode: OPERATION_MODE.Create, id: null });
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
						<Button variant='contained' color='primary' onClick={handleDutyForm} mb={2}>
							New Duty
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
										<h5>Purchase Order No</h5>
										<h2>{poNumbers || ''}</h2>
									</Stack>
								</Grid>
								<Grid item sm={3}>
									<Stack spacing={0.5}>
										<h5>Reference No</h5>
										<h2>{shipment?.referenceNo || ''}</h2>
									</Stack>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			<MainCard>
				<DutyList handleDutyForm={handleDutyForm} shipmentId={shipment?.id} />
			</MainCard>

			<ShipmentProvider>
				<Duty
					openPanel={openPanel}
					setOpenPanel={setOpenPanel}
					openDeleteModal={openDeleteModal}
					setOpenDeleteModal={setOpenDeleteModal}
					selectedDuty={selectedDuty}
					setSelectedDuty={setSelectedDuty}
					shipment={shipment}
				/>
			</ShipmentProvider>
		</>
	);
};

export default ShipmentDutyMaintenance;
