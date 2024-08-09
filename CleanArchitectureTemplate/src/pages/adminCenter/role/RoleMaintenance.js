import React, { useState } from 'react';

// MUI
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Stack } from '@mui/material';

// ASSETS
import { UserAddOutlined } from '@ant-design/icons';

// PROJECT IMPORT
import RoleList from './views/lists/RoleList';
import Role from './views/features/Role';

// CONTEXTS
import { RoleProvider } from './contexts/RoleContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import navigation from 'containers/menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';

// ==============================|| CABINET MAINTENANCE ||============================== //

const RoleMaintenance = () => {
	const theme = useTheme();
	const [openPanel, setOpenPanel] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedRole, setSelectedRole] = useState({ mode: null, id: null });

	const handleRoleForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.View:
				setSelectedRole({ mode: OPERATION_MODE.View, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Edit:
				setSelectedRole({ mode: OPERATION_MODE.Edit, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Delete:
				setSelectedRole({ mode: OPERATION_MODE.Delete, id: record });
				setOpenDeleteModal(true);
				break;

			default:
				setSelectedRole({ mode: OPERATION_MODE.Create, id: null });
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
						<Button variant='contained' color='primary' onClick={handleRoleForm}>
							New Role
						</Button>
					</Stack>
				</Stack>
			</>
			{/* COMMAND BAR SECTION */}

			{/* CABINET GRID SECTION */}
			<>
			<MainCard>
				<RoleList handleRoleForm={handleRoleForm} />
			</MainCard>
			</>
			{/* CABINET GRID SECTION */}

			{/* CABINET FORM SECTION */}
			<>
				<RoleProvider>
					<Role
						openPanel={openPanel}
						setOpenPanel={setOpenPanel}
						openDeleteModal={openDeleteModal}
						setOpenDeleteModal={setOpenDeleteModal}
						selectedRole={selectedRole}
						setSelectedRole={setSelectedRole}
					/>
				</RoleProvider>
			</>
			{/* CABINET FORM SECTION */}
		</>
	);
};

export default RoleMaintenance;
