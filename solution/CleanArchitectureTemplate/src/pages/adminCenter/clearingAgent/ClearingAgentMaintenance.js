import React, { useState } from 'react';

// MUI
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Stack } from '@mui/material';

// ASSETS
import { UserAddOutlined } from '@ant-design/icons';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';

// PROJECT IMPORT
import ClearingAgentList from './views/lists/ClearingAgentList';
import ClearingAgent from './views/features/ClearingAgent';
import navigation from 'containers/menu-items';

// CONTEXTS
import { ClearingAgentProvider } from './contexts/ClearingAgentContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';

// ==============================|| CABINET MAINTENANCE ||============================== //

const ClearingAgentMaintenance = () => {
	const theme = useTheme();
	const [openPanel, setOpenPanel] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedClearingAgent, setSelectedClearingAgent] = useState({ mode: null, id: null });

	const handleClearingAgentForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.View:
				setSelectedClearingAgent({ mode: OPERATION_MODE.View, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Edit:
				setSelectedClearingAgent({ mode: OPERATION_MODE.Edit, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Delete:
				setSelectedClearingAgent({ mode: OPERATION_MODE.Delete, id: record });
				setOpenDeleteModal(true);
				break;

			default:
				setSelectedClearingAgent({ mode: OPERATION_MODE.Create, id: null });
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
						<Breadcrumbs navigation={navigation}/>
						<Button variant='contained' color='primary' onClick={handleClearingAgentForm}>
							New Clearing Agent
						</Button>
					</Stack>
				</Stack>
			</>
			{/* COMMAND BAR SECTION */}

			{/* CABINET GRID SECTION */}
			<>
			<MainCard>
				<ClearingAgentList handleClearingAgentForm={handleClearingAgentForm} />
			</MainCard>
			</>
			{/* CABINET GRID SECTION */}

			{/* CABINET FORM SECTION */}
			<>
				<ClearingAgentProvider>
					<ClearingAgent
						openPanel={openPanel}
						setOpenPanel={setOpenPanel}
						openDeleteModal={openDeleteModal}
						setOpenDeleteModal={setOpenDeleteModal}
						selectedClearingAgent={selectedClearingAgent}
						setSelectedClearingAgent={setSelectedClearingAgent}
					/>
				</ClearingAgentProvider>
			</>
			{/* CABINET FORM SECTION */}
		</>
	);
};

export default ClearingAgentMaintenance;
