import React, { useState } from 'react';

// MUI
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Stack } from '@mui/material';

// ASSETS
import { UserAddOutlined } from '@ant-design/icons';

// PROJECT IMPORT
import CompanyList from './views/lists/CompanyList';
import Company from './views/features/Company';

// CONTEXTS
import { CompanyProvider } from './contexts/CompanyContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import ViewHandler from './components/ViewHandler';
import User from '../user/views/features/User';
import navigation from 'containers/menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';


// ==============================|| CABINET MAINTENANCE ||============================== //

const CompanyMaintenance = () => {
	const theme = useTheme();
	const [openPanel, setOpenPanel] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedCompany, setSelectedCompany] = useState({ mode: null, id: null });

	const handleCompanyForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.View:
				setSelectedCompany({ mode: OPERATION_MODE.View, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Edit:
				setSelectedCompany({ mode: OPERATION_MODE.Edit, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.AssignUser:
				setSelectedCompany({ mode: OPERATION_MODE.AssignUser, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Delete:
				setSelectedCompany({ mode: OPERATION_MODE.Delete, id: record });
				setOpenDeleteModal(true);
				break;

			default:
				setSelectedCompany({ mode: OPERATION_MODE.Create, id: null });
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
						<Button variant='contained' color='primary' onClick={handleCompanyForm}>
							New Company
						</Button>
					</Stack>
				</Stack>
			</>
			{/* COMMAND BAR SECTION */}

			{/* CABINET GRID SECTION */}
			<>
			<MainCard>
				<CompanyList handleCompanyForm={handleCompanyForm} />
			</MainCard>
			</>
			{/* CABINET GRID SECTION */}

			{/* CABINET FORM SECTION */}
			<>
				<CompanyProvider>
					<ViewHandler
						openPanel={openPanel}
						setOpenPanel={setOpenPanel}
						openDeleteModal={openDeleteModal}
						setOpenDeleteModal={setOpenDeleteModal}
						selectedCompany={selectedCompany}
						setSelectedCompany={setSelectedCompany}
					/>
					{/* <User
						openPanel={openPanel}
						setOpenPanel={setOpenPanel}
						openDeleteModal={openDeleteModal}
						setOpenDeleteModal={setOpenDeleteModal}
						selectedCompany={selectedCompany}
						setSelectedCompany={setSelectedCompany}
					/> */}
				</CompanyProvider>

				{/* <UserProvider>
					<User
						openPanel={openPanel}
						setOpenPanel={setOpenPanel}
						openDeleteModal={openDeleteModal}
						setOpenDeleteModal={setOpenDeleteModal}
						selectedUser={selectedUser}
						setSelectedUser={setSelectedUser}
					/>
				</UserProvider> */}
			</>
			{/* CABINET FORM SECTION */}
		</>
	);
};

export default CompanyMaintenance;
