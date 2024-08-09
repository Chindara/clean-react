import React, { useState } from 'react';

// MUI
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Stack } from '@mui/material';

// ASSETS
import { UserAddOutlined } from '@ant-design/icons';

// PROJECT IMPORT
import VendorList from './views/lists/VendorList';
import Vendor from './views/features/Vendor';

// CONTEXTS
import { VendorProvider } from './contexts/VendorContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import navigation from 'containers/menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';

// ==============================|| CABINET MAINTENANCE ||============================== //

const VendorMaintenance = () => {
	const theme = useTheme();
	const [openPanel, setOpenPanel] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedVendor, setSelectedVendor] = useState({ mode: null, id: null });

	const handleVendorForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.View:
				setSelectedVendor({ mode: OPERATION_MODE.View, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Edit:
				setSelectedVendor({ mode: OPERATION_MODE.Edit, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Delete:
				setSelectedVendor({ mode: OPERATION_MODE.Delete, id: record });
				setOpenDeleteModal(true);
				break;

			default:
				setSelectedVendor({ mode: OPERATION_MODE.Create, id: null });
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
						<Button variant='contained' color='primary' onClick={handleVendorForm}>
							New Vendor
						</Button>
					</Stack>
				</Stack>
			</>
			{/* COMMAND BAR SECTION */}

			{/* CABINET GRID SECTION */}
			<>
			<MainCard>
				<VendorList handleVendorForm={handleVendorForm} />
			</MainCard>
			</>
			{/* CABINET GRID SECTION */}

			{/* CABINET FORM SECTION */}
			<>
				<VendorProvider>
					<Vendor
						openPanel={openPanel}
						setOpenPanel={setOpenPanel}
						openDeleteModal={openDeleteModal}
						setOpenDeleteModal={setOpenDeleteModal}
						selectedVendor={selectedVendor}
						setSelectedVendor={setSelectedVendor}
					/>
				</VendorProvider>
			</>
			{/* CABINET FORM SECTION */}
		</>
	);
};

export default VendorMaintenance;
