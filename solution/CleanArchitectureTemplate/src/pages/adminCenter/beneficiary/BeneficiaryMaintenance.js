import React, { useState } from 'react';

// MUI
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Stack } from '@mui/material';
import MainCard from 'components/MainCard';
import navigation from 'containers/menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// ASSETS
import { UserAddOutlined } from '@ant-design/icons';

// PROJECT IMPORT
import BeneficiaryList from './views/lists/BeneficiaryList';
import Beneficiary from './views/features/Beneficiary';

// CONTEXTS
import { BeneficiaryProvider } from './contexts/BeneficiaryContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import ExportExcelButton from 'components/ExportExcelButton';

const BeneficiaryMaintenance = () => {
	const theme = useTheme();
	const [openPanel, setOpenPanel] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedBeneficiary, setSelectedBeneficiary] = useState({ mode: null, id: null });
	const [reportData, setReportData] = useState([]);

	const handleBeneficiaryForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.View:
				setSelectedBeneficiary({ mode: OPERATION_MODE.View, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Edit:
				setSelectedBeneficiary({ mode: OPERATION_MODE.Edit, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Delete:
				setSelectedBeneficiary({ mode: OPERATION_MODE.Delete, id: record });
				setOpenDeleteModal(true);
				break;

			default:
				setSelectedBeneficiary({ mode: OPERATION_MODE.Create, id: null });
				setOpenPanel(true);
				break;
		}
	};

	return (
		<>
			<Stack spacing={2}>
				<Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
					<Breadcrumbs navigation={navigation} />
					<Button variant='contained' color='primary' onClick={handleBeneficiaryForm}>
						New Beneficiary
					</Button>
				</Stack>
			</Stack>
			<MainCard>
				<BeneficiaryList handleBeneficiaryForm={handleBeneficiaryForm} setReportData={setReportData} />
			</MainCard>

			<BeneficiaryProvider>
				<Beneficiary
					openPanel={openPanel}
					setOpenPanel={setOpenPanel}
					openDeleteModal={openDeleteModal}
					setOpenDeleteModal={setOpenDeleteModal}
					selectedBeneficiary={selectedBeneficiary}
					setSelectedBeneficiary={setSelectedBeneficiary}
				/>
			</BeneficiaryProvider>
		</>
	);
};

export default BeneficiaryMaintenance;
