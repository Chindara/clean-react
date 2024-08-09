import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Stack } from '@mui/material';
import { UserAddOutlined } from '@ant-design/icons';
import ShipmentCostCategoryList from './views/lists/ShipmentCostCategoryList';
import ShipmentCostCategory from './views/features/ShipmentCostCategory';
import { ShipmentCostCategoryProvider } from './contexts/ShipmentCostCategoryContext';
import { OPERATION_MODE } from 'constants/Types';
import navigation from 'containers/menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';

const ShipmentCostCategoryMaintenance = () => {
	const theme = useTheme();
	const [openPanel, setOpenPanel] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedShipmentCostCategory, setSelectedShipmentCostCategory] = useState({ mode: null, id: null });

	const handleShipmentCostCategoryForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.View:
				setSelectedShipmentCostCategory({ mode: OPERATION_MODE.View, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Edit:
				setSelectedShipmentCostCategory({ mode: OPERATION_MODE.Edit, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Delete:
				setSelectedShipmentCostCategory({ mode: OPERATION_MODE.Delete, id: record });
				setOpenDeleteModal(true);
				break;

			default:
				setSelectedShipmentCostCategory({ mode: OPERATION_MODE.Create, id: null });
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
						<Button variant='contained' color='primary' onClick={handleShipmentCostCategoryForm}>
							New Shipment Cost Category
						</Button>
					</Stack>
				</Stack>
			</>
			{/* COMMAND BAR SECTION */}

			{/* CABINET GRID SECTION */}
			<>
				<MainCard>
					<ShipmentCostCategoryList handleShipmentCostCategoryForm={handleShipmentCostCategoryForm} />
				</MainCard>
			</>
			{/* CABINET GRID SECTION */}

			{/* CABINET FORM SECTION */}
			<>
				<ShipmentCostCategoryProvider>
					<ShipmentCostCategory
						openPanel={openPanel}
						setOpenPanel={setOpenPanel}
						openDeleteModal={openDeleteModal}
						setOpenDeleteModal={setOpenDeleteModal}
						selectedShipmentCostCategory={selectedShipmentCostCategory}
						setSelectedShipmentCostCategory={setSelectedShipmentCostCategory}
					/>
				</ShipmentCostCategoryProvider>
			</>
			{/* CABINET FORM SECTION */}
		</>
	);
};

export default ShipmentCostCategoryMaintenance;
