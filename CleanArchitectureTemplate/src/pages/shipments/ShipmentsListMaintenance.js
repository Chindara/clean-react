import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import breadcrumbItems from 'containers/menu-items/breadcrumbs';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// MUI
import { Button, IconButton, Stack } from '@mui/material';
import MainCard from 'components/MainCard';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';

//CONTEXT
import { ShipmentProvider } from './contexts/ShipmentsContext';

// PROJECT IMPORT
import ShipmentList from './views/lists/ShipmentList';
import Shipment from './views/features/Shipment';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';

const ShipmentMaintenance = () => {
	const navigate = useNavigate();
	const [openUpdateStatusModal, setOpenUpdateStatusModal] = useState(false);
	const [selectedShipment, setSelectedShipment] = useState({ mode: null, id: null });
	const [searchVisible, setSearchVisible] = useState(false);

	const handleSearchBar = () => {
		setSearchVisible(!searchVisible);
	};

	const handleShipmentForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.Other:
				setSelectedShipment({ mode: OPERATION_MODE.Other, id: record });
				setOpenUpdateStatusModal(true);
				break;
		}
	};
	return (
		<>
			<Stack spacing={2}>
				<Stack direction='row' alignItems='flex-start' justifyContent='space-between'>
					<Breadcrumbs navigation={breadcrumbItems} />
					<Stack direction='row' alignItems='center' justifyContent='flex-start' spacing={1}>
						<Button
							variant='contained'
							color='primary'
							onClick={() => {
								navigate(`/shipment/form?mode=${OPERATION_MODE.Create}`);
							}}
						>
							New Shipment
						</Button>
						<IconButton color='primary' onClick={handleSearchBar}>
							<FilterListOutlinedIcon />
						</IconButton>
					</Stack>
				</Stack>
			</Stack>
			<MainCard>
				<ShipmentList handleShipmentForm={handleShipmentForm} searchVisible={searchVisible} setSearchVisible={setSearchVisible} />
			</MainCard>

			<ShipmentProvider>
				<Shipment
					openUpdateStatusModal={openUpdateStatusModal}
					setOpenUpdateStatusModal={setOpenUpdateStatusModal}
					selectedShipment={selectedShipment}
					setSelectedShipment={setSelectedShipment}
				/>
			</ShipmentProvider>
		</>
	);
};

export default ShipmentMaintenance;
