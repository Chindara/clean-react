import React, { useState } from 'react';

// MUI
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Stack } from '@mui/material';

// ASSETS
import { UserAddOutlined } from '@ant-design/icons';

// PROJECT IMPORT
import SubPaymentMethodList from './views/lists/SubPaymentMethodList';
import SubPaymentMethod from './views/features/SubPaymentMethod';

// CONTEXTS
import { SubPaymentMethodProvider } from './contexts/SubPaymentMethodContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import navigation from 'containers/menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';

// ==============================|| CABINET MAINTENANCE ||============================== //

const SubPaymentMethodMaintenance = () => {
	const theme = useTheme();
	const [openPanel, setOpenPanel] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedSubPaymentMethod, setSelectedSubPaymentMethod] = useState({ mode: null, id: null });

	const handleSubPaymentMethodForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.View:
				setSelectedSubPaymentMethod({ mode: OPERATION_MODE.View, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Edit:
				setSelectedSubPaymentMethod({ mode: OPERATION_MODE.Edit, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Delete:
				setSelectedSubPaymentMethod({ mode: OPERATION_MODE.Delete, id: record });
				setOpenDeleteModal(true);
				break;

			default:
				setSelectedSubPaymentMethod({ mode: OPERATION_MODE.Create, id: null });
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
						<Button variant='contained' color='primary' onClick={handleSubPaymentMethodForm}>
							New Sub Payment Method
						</Button>
					</Stack>
				</Stack>
			</>
			{/* COMMAND BAR SECTION */}

			{/* CABINET GRID SECTION */}
			<>
			<MainCard>
				<SubPaymentMethodList handleSubPaymentMethodForm={handleSubPaymentMethodForm} />
				</MainCard>
			</>
			{/* CABINET GRID SECTION */}

			{/* CABINET FORM SECTION */}
			<>
				<SubPaymentMethodProvider>
					<SubPaymentMethod
						openPanel={openPanel}
						setOpenPanel={setOpenPanel}
						openDeleteModal={openDeleteModal}
						setOpenDeleteModal={setOpenDeleteModal}
						selectedSubPaymentMethod={selectedSubPaymentMethod}
						setSelectedSubPaymentMethod={setSelectedSubPaymentMethod}
					/>
				</SubPaymentMethodProvider>
			</>
			{/* CABINET FORM SECTION */}
		</>
	);
};

export default SubPaymentMethodMaintenance;
