import React, { useState } from 'react';

// MUI
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Stack } from '@mui/material';

// ASSETS
import { UserAddOutlined } from '@ant-design/icons';

// PROJECT IMPORT
import CurrencyList from './views/lists/CurrencyList';
import Currency from './views/features/Currency';
import navigation from 'containers/menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';

// CONTEXTS
import { CurrencyProvider } from './contexts/CurrencyContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';

// ==============================|| CABINET MAINTENANCE ||============================== //

const CurrencyMaintenance = () => {
	const theme = useTheme();
	const [openPanel, setOpenPanel] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedCurrency, setSelectedCurrency] = useState({ mode: null, id: null });

	const handleCurrencyForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.View:
				setSelectedCurrency({ mode: OPERATION_MODE.View, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Edit:
				setSelectedCurrency({ mode: OPERATION_MODE.Edit, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Delete:
				setSelectedCurrency({ mode: OPERATION_MODE.Delete, id: record });
				setOpenDeleteModal(true);
				break;

			default:
				setSelectedCurrency({ mode: OPERATION_MODE.Create, id: null });
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
						<Button variant='contained' color='primary' onClick={handleCurrencyForm}>
							New Currency
						</Button>
					</Stack>
				</Stack>
			</>
			{/* COMMAND BAR SECTION */}

			{/* CABINET GRID SECTION */}
			<>
			<MainCard>
				<CurrencyList handleCurrencyForm={handleCurrencyForm} />
			</MainCard>
			</>
			{/* CABINET GRID SECTION */}

			{/* CABINET FORM SECTION */}
			<>
				<CurrencyProvider>
					<Currency
						openPanel={openPanel}
						setOpenPanel={setOpenPanel}
						openDeleteModal={openDeleteModal}
						setOpenDeleteModal={setOpenDeleteModal}
						selectedCurrency={selectedCurrency}
						setSelectedCurrency={setSelectedCurrency}
					/>
				</CurrencyProvider>
			</>
			{/* CABINET FORM SECTION */}
		</>
	);
};

export default CurrencyMaintenance;
