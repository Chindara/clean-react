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
import BankList from './views/lists/BankList';
import Bank from './views/features/Bank';

// CONTEXTS
import { BankProvider } from './contexts/BankContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import ExportExcelButton from 'components/ExportExcelButton';

const BankMaintenance = () => {
	const theme = useTheme();
	const [openPanel, setOpenPanel] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedBank, setSelectedBank] = useState({ mode: null, id: null });
	const [reportData, setReportData] = useState([]);

	const handleBankForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.View:
				setSelectedBank({ mode: OPERATION_MODE.View, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Edit:
				setSelectedBank({ mode: OPERATION_MODE.Edit, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Delete:
				setSelectedBank({ mode: OPERATION_MODE.Delete, id: record });
				setOpenDeleteModal(true);
				break;

			default:
				setSelectedBank({ mode: OPERATION_MODE.Create, id: null });
				setOpenPanel(true);
				break;
		}
	};

	return (
		<>
			<Stack spacing={2}>
				<Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
					<Breadcrumbs navigation={navigation} />
					<Button variant='contained' color='primary' onClick={handleBankForm}>
						New Bank
					</Button>
				</Stack>
			</Stack>
			<MainCard>
				<BankList handleBankForm={handleBankForm} setReportData={setReportData} />
			</MainCard>

			<BankProvider>
				<Bank
					openPanel={openPanel}
					setOpenPanel={setOpenPanel}
					openDeleteModal={openDeleteModal}
					setOpenDeleteModal={setOpenDeleteModal}
					selectedBank={selectedBank}
					setSelectedBank={setSelectedBank}
				/>
			</BankProvider>
		</>
	);
};

export default BankMaintenance;
