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
import Guarantee from './views/features/ShipmentGuarantee';
import GuaranteeList from './views/lists/ShipmentGuaranteeListForm';
// CONTEXTS
import { NonPoShipmentProvider } from './contexts/NonPoShipmentContext';

// CONSTANTS
import { SHIPMENT_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import IconButton from 'components/@extended/IconButton';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { setAlertError } from 'components/alert/Alert';
import PurchaseOrderService from 'services/PurchaseOrderService';
import useAuth from 'hooks/useAuth';
import MainCard from 'components/MainCard';
import navigation from 'containers/menu-items';
import GuaranteeService from 'services/ShipmentGuaranteeService';
import NonPOShipmentService from 'services/NonPoShipmentService';

const NonPoShipmentGuaranteesMaintenance = () => {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();

	const [searchParams, setSearchParams] = useSearchParams();
	const [NonPoshipment, setNonPoShipment] = useState({
		id: Number(searchParams.get('id')),
	});

	const {
		data: { currentGuarantee, shipmentReferenceNo, poNumber },
		isFetching,
	} = useQuery({
		queryKey: ['shipmentGuarantee'],
		queryFn: () => getnonPoShipments(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentGuarantee: {}, shipmentReferenceNo: '', poNumber: '' },
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

		return { currentGuarantee: record, shipmentReferenceNo, poNumber };
	};

	useEffect(() => {
		setNonPoShipment({ ...NonPoshipment, ...currentGuarantee });
	}, [currentGuarantee]);

	const theme = useTheme();
	const navigate = useNavigate();
	const [openPanel, setOpenPanel] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedGuarantee, setSelectedGuarantee] = useState({ mode: null, id: null });

	const handleGuaranteeForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.View:
				setSelectedGuarantee({ mode: OPERATION_MODE.View, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Edit:
				setSelectedGuarantee({ mode: OPERATION_MODE.Edit, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Delete:
				setSelectedGuarantee({ mode: OPERATION_MODE.Delete, id: record });
				setOpenDeleteModal(true);
				break;

			default:
				setSelectedGuarantee({ mode: OPERATION_MODE.Create, id: null });
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
						<Button variant='contained' color='primary' onClick={handleGuaranteeForm} mb={2}>
							New Guarantee
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
										<h2>{poNumber || ''}</h2>
									</Stack>
								</Grid>
								<Grid item sm={3}>
									<Stack spacing={0.5}>
										<h5>Reference No</h5>
										<h2>{shipmentReferenceNo || ''}</h2>
									</Stack>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			<MainCard>
				<GuaranteeList handleGuaranteeForm={handleGuaranteeForm} shipmentId={NonPoshipment?.id} />
			</MainCard>

			<NonPoShipmentProvider>
				<Guarantee
					openPanel={openPanel}
					setOpenPanel={setOpenPanel}
					openDeleteModal={openDeleteModal}
					setOpenDeleteModal={setOpenDeleteModal}
					selectedGuarantee={selectedGuarantee}
					setSelectedGuarantee={setSelectedGuarantee}
					shipment={NonPoshipment}
				/>
			</NonPoShipmentProvider>
		</>
	);
};

export default NonPoShipmentGuaranteesMaintenance;
