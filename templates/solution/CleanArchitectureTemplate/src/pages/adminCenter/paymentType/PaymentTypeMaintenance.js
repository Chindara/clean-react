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
import PaymentTypeList from './views/lists/PaymentTypeList';
import PaymentType from './views/features/PaymentType';

// CONTEXTS
import { PaymentTypeProvider } from './contexts/PaymentTypeContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import ExportExcelButton from 'components/ExportExcelButton';

const PaymentTypeMaintenance = () => {
	const theme = useTheme();
	const [openPanel, setOpenPanel] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedPaymentType, setSelectedPaymentType] = useState({ mode: null, id: null });
	const [reportData, setReportData] = useState([]);

	const handlePaymentTypeForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.View:
				setSelectedPaymentType({ mode: OPERATION_MODE.View, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Edit:
				setSelectedPaymentType({ mode: OPERATION_MODE.Edit, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Delete:
				setSelectedPaymentType({ mode: OPERATION_MODE.Delete, id: record });
				setOpenDeleteModal(true);
				break;

			default:
				setSelectedPaymentType({ mode: OPERATION_MODE.Create, id: null });
				setOpenPanel(true);
				break;
		}
	};

	return (
		<>
			<Stack spacing={2}>
				<Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
					<Breadcrumbs navigation={navigation} />
					<Button variant='contained' color='primary' onClick={handlePaymentTypeForm}>
						New Payment Type
					</Button>
				</Stack>
			</Stack>
			<MainCard>
				<PaymentTypeList handlePaymentTypeForm={handlePaymentTypeForm} setReportData={setReportData} />
			</MainCard>

			<PaymentTypeProvider>
				<PaymentType
					openPanel={openPanel}
					setOpenPanel={setOpenPanel}
					openDeleteModal={openDeleteModal}
					setOpenDeleteModal={setOpenDeleteModal}
					selectedPaymentType={selectedPaymentType}
					setSelectedPaymentType={setSelectedPaymentType}
				/>
			</PaymentTypeProvider>
		</>
	);
};

export default PaymentTypeMaintenance;
