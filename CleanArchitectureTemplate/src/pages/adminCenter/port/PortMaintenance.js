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
import PortList from './views/lists/PortList';
import Port from './views/features/Port';

// CONTEXTS
import { PortProvider } from './contexts/PortContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import ExportExcelButton from 'components/ExportExcelButton';

const PortMaintenance = () => {
	const theme = useTheme();
	const [openPanel, setOpenPanel] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedPort, setSelectedPort] = useState({ mode: null, id: null });
	const [reportData, setReportData] = useState([]);

	const handlePortForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.View:
				setSelectedPort({ mode: OPERATION_MODE.View, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Edit:
				setSelectedPort({ mode: OPERATION_MODE.Edit, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Delete:
				setSelectedPort({ mode: OPERATION_MODE.Delete, id: record });
				setOpenDeleteModal(true);
				break;

			default:
				setSelectedPort({ mode: OPERATION_MODE.Create, id: null });
				setOpenPanel(true);
				break;
		}
	};

	return (
		<>
			<Stack spacing={2}>
				<Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
					<Breadcrumbs navigation={navigation} />
					<Button variant='contained' color='primary' onClick={handlePortForm}>
						New Port
					</Button>
				</Stack>
			</Stack>
			<MainCard>
				<PortList handlePortForm={handlePortForm} setReportData={setReportData} />
			</MainCard>

			<PortProvider>
				<Port
					openPanel={openPanel}
					setOpenPanel={setOpenPanel}
					openDeleteModal={openDeleteModal}
					setOpenDeleteModal={setOpenDeleteModal}
					selectedPort={selectedPort}
					setSelectedPort={setSelectedPort}
				/>
			</PortProvider>
		</>
	);
};

export default PortMaintenance;
