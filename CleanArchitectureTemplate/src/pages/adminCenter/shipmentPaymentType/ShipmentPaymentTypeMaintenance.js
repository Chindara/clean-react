import React, { useState } from 'react';

// MUI
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Stack } from '@mui/material';

// ASSETS
import { UserAddOutlined } from '@ant-design/icons';

// PROJECT IMPORT
import ShipmentPaymentTypeList from './views/lists/ShipmentPaymentTypeList';
import ShipmentPaymentType from './views/features/ShipmentPaymentType';

// CONTEXTS
import { ShipmentPaymentTypeProvider } from './contexts/ShipmentPaymentTypeContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import navigation from 'containers/menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';

// ==============================|| CABINET MAINTENANCE ||============================== //

const ShipmentPaymentTypeMaintenance = () => {
	const theme = useTheme();
	const [openPanel, setOpenPanel] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedShipmentPaymentType, setSelectedShipmentPaymentType] = useState({ mode: null, id: null });

	const handleShipmentPaymentTypeForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.View:
				setSelectedShipmentPaymentType({ mode: OPERATION_MODE.View, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Edit:
				setSelectedShipmentPaymentType({ mode: OPERATION_MODE.Edit, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Delete:
				setSelectedShipmentPaymentType({ mode: OPERATION_MODE.Delete, id: record });
				setOpenDeleteModal(true);
				break;

			default:
				setSelectedShipmentPaymentType({ mode: OPERATION_MODE.Create, id: null });
				setOpenPanel(true);
				break;
		}
	};

	return (
		<>
			{/* COMMAND BAR SECTION */}
			<>
				<Stack spacing={2}>
					<Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
						<Breadcrumbs navigation={navigation} />
						<Button variant='contained' color='primary' onClick={handleShipmentPaymentTypeForm}>
							New Shipment Payment Type
						</Button>
					</Stack>
				</Stack>
			</>
			{/* COMMAND BAR SECTION */}

			{/* CABINET GRID SECTION */}
			<>
				<MainCard>
					<ShipmentPaymentTypeList handleShipmentPaymentTypeForm={handleShipmentPaymentTypeForm} />
				</MainCard>
			</>
			{/* CABINET GRID SECTION */}

			{/* CABINET FORM SECTION */}
			<>
				<ShipmentPaymentTypeProvider>
					<ShipmentPaymentType
						openPanel={openPanel}
						setOpenPanel={setOpenPanel}
						openDeleteModal={openDeleteModal}
						setOpenDeleteModal={setOpenDeleteModal}
						selectedShipmentPaymentType={selectedShipmentPaymentType}
						setSelectedShipmentPaymentType={setSelectedShipmentPaymentType}
					/>
				</ShipmentPaymentTypeProvider>
			</>
			{/* CABINET FORM SECTION */}
		</>
	);
};

export default ShipmentPaymentTypeMaintenance;
