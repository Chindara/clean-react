import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import breadcrumbItems from 'containers/menu-items/breadcrumbs';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// MUI
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Stack } from '@mui/material';

// ASSETS
import { UserAddOutlined } from '@ant-design/icons';
import { FaArrowAltCircleLeft } from 'react-icons/fa';

// PROJECT IMPORT
//import PurchaseOrder from './views/features/PurchaseOrder';

// CONTEXTS
//import { PurchaseOrderProvider } from './contexts/PurchaseOrderContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { ShipmentProvider } from './contexts/ShipmentsContext';
import IconButton from 'components/@extended/IconButton';
import Shipment from './views/features/Shipment';
import MainCard from 'components/MainCard';

const ShipmentFormMaintenance = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const [selectedShipment, setSelectedShipment] = useState({
		mode: Number(searchParams.get('mode')),
		id: searchParams.get('id'),
	});

	return (
		<>
			{/* COMMAND BAR SECTION */}
			<>
				<Stack spacing={2}>
					<Stack direction='row' alignItems='flex-start' justifyContent='space-between'>
						<Breadcrumbs navigation={breadcrumbItems} />
						<IconButton
							aria-label='back'
							onClick={() => {
								navigate(`..`);
							}}
						>
							<FaArrowAltCircleLeft style={{ fontSize: '1.2rem' }} />
						</IconButton>
					</Stack>
				</Stack>
			</>
			{/* COMMAND BAR SECTION */}

			{/* CABINET GRID SECTION */}
			<MainCard>
				<ShipmentProvider>
					<Shipment selectedShipment={selectedShipment} setSelectedShipment={setSelectedShipment} />
				</ShipmentProvider>
			</MainCard>
			{/* CABINET GRID SECTION */}
		</>
	);
};

export default ShipmentFormMaintenance;
