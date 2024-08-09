import React, { useState } from 'react';

// MUI
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Stack } from '@mui/material';

// ASSETS
import { UserAddOutlined } from '@ant-design/icons';

// PROJECT IMPORT
import LicenseApprovalList from './views/lists/LicenseApprovalList';
import LicenseApproval from './views/features/LicenseApproval';
import navigation from 'containers/menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';

// CONTEXTS
import { LicenseApprovalProvider } from './contexts/LicenseApprovalContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';

// ==============================|| CABINET MAINTENANCE ||============================== //

const LicenseApprovalMaintenance = () => {
	const theme = useTheme();
	const [openPanel, setOpenPanel] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedLicenseApproval, setSelectedLicenseApproval] = useState({ mode: null, id: null });

	const handleLicenseApprovalForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.View:
				setSelectedLicenseApproval({ mode: OPERATION_MODE.View, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Edit:
				setSelectedLicenseApproval({ mode: OPERATION_MODE.Edit, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Delete:
				setSelectedLicenseApproval({ mode: OPERATION_MODE.Delete, id: record });
				setOpenDeleteModal(true);
				break;

			default:
				setSelectedLicenseApproval({ mode: OPERATION_MODE.Create, id: null });
				setOpenPanel(true);
				break;
		}
	};

	return (
		<>
			<Stack spacing={2}>
				<Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
					<Breadcrumbs navigation={navigation} />
					<Button variant='contained' color='primary' onClick={handleLicenseApprovalForm}>
						New License Approval
					</Button>
				</Stack>
			</Stack>
			<MainCard>
				<LicenseApprovalList handleLicenseApprovalForm={handleLicenseApprovalForm} />
			</MainCard>
			<LicenseApprovalProvider>
				<LicenseApproval
					openPanel={openPanel}
					setOpenPanel={setOpenPanel}
					openDeleteModal={openDeleteModal}
					setOpenDeleteModal={setOpenDeleteModal}
					selectedLicenseApproval={selectedLicenseApproval}
					setSelectedLicenseApproval={setSelectedLicenseApproval}
				/>
			</LicenseApprovalProvider>
		</>
	);
};

export default LicenseApprovalMaintenance;
