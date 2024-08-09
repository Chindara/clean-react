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
import NatureOfPurchaseList from './views/lists/NatureOfPurchaseList';
import NatureOfPurchase from './views/features/NatureOfPurchase';

// CONTEXTS
import { NatureOfPurchaseProvider } from './contexts/NatureOfPurchaseContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import ExportExcelButton from 'components/ExportExcelButton';

const NatureOfPurchaseMaintenance = () => {
	const theme = useTheme();
	const [openPanel, setOpenPanel] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedNatureOfPurchase, setSelectedNatureOfPurchase] = useState({ mode: null, id: null });
	const [reportData, setReportData] = useState([]);

	const handleNatureOfPurchaseForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.View:
				setSelectedNatureOfPurchase({ mode: OPERATION_MODE.View, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Edit:
				setSelectedNatureOfPurchase({ mode: OPERATION_MODE.Edit, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Delete:
				setSelectedNatureOfPurchase({ mode: OPERATION_MODE.Delete, id: record });
				setOpenDeleteModal(true);
				break;

			default:
				setSelectedNatureOfPurchase({ mode: OPERATION_MODE.Create, id: null });
				setOpenPanel(true);
				break;
		}
	};

	return (
		<>
			<Stack spacing={2}>
				<Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
					<Breadcrumbs navigation={navigation} />
					<Button variant='contained' color='primary' onClick={handleNatureOfPurchaseForm}>
						New Nature Of Purchase
					</Button>
				</Stack>
			</Stack>
			<MainCard>
				<NatureOfPurchaseList handleNatureOfPurchaseForm={handleNatureOfPurchaseForm} setReportData={setReportData} />
			</MainCard>

			<NatureOfPurchaseProvider>
				<NatureOfPurchase
					openPanel={openPanel}
					setOpenPanel={setOpenPanel}
					openDeleteModal={openDeleteModal}
					setOpenDeleteModal={setOpenDeleteModal}
					selectedNatureOfPurchase={selectedNatureOfPurchase}
					setSelectedNatureOfPurchase={setSelectedNatureOfPurchase}
				/>
			</NatureOfPurchaseProvider>
		</>
	);
};

export default NatureOfPurchaseMaintenance;
