import React, { useState } from 'react';

// MUI
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Stack } from '@mui/material';

// ASSETS
import { UserAddOutlined } from '@ant-design/icons';

// PROJECT IMPORT
import EntityList from './views/lists/EntityList';
import Entity from './views/features/Entity';

// CONTEXTS
import { EntityProvider } from './contexts/EntityContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import navigation from 'containers/menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';

// ==============================|| CABINET MAINTENANCE ||============================== //

const EntityMaintenance = () => {
	const theme = useTheme();
	const [openPanel, setOpenPanel] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedEntity, setSelectedEntity] = useState({ mode: null, id: null });

	const handleEntityForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.View:
				setSelectedEntity({ mode: OPERATION_MODE.View, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Edit:
				setSelectedEntity({ mode: OPERATION_MODE.Edit, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Delete:
				setSelectedEntity({ mode: OPERATION_MODE.Delete, id: record });
				setOpenDeleteModal(true);
				break;

			default:
				setSelectedEntity({ mode: OPERATION_MODE.Create, id: null });
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
						<Button variant='contained' color='primary' onClick={handleEntityForm}>
							New Entity
						</Button>
					</Stack>
				</Stack>
			</>
			{/* COMMAND BAR SECTION */}

			{/* CABINET GRID SECTION */}
			<>
			<MainCard>
				<EntityList handleEntityForm={handleEntityForm} />
			</MainCard>
			</>
			{/* CABINET GRID SECTION */}

			{/* CABINET FORM SECTION */}
			<>
				<EntityProvider>
					<Entity
						openPanel={openPanel}
						setOpenPanel={setOpenPanel}
						openDeleteModal={openDeleteModal}
						setOpenDeleteModal={setOpenDeleteModal}
						selectedEntity={selectedEntity}
						setSelectedEntity={setSelectedEntity}
					/>
				</EntityProvider>
			</>
			{/* CABINET FORM SECTION */}
		</>
	);
};

export default EntityMaintenance;
