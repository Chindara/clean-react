import React, { useState } from 'react';

// MUI
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Stack } from '@mui/material';

// ASSETS
import { UserAddOutlined } from '@ant-design/icons';

// PROJECT IMPORT
import CountryList from './views/lists/CountryList';
import Country from './views/features/Country';
import navigation from 'containers/menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';

// CONTEXTS
import { CountryProvider } from './contexts/CountryContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';

// ==============================|| CABINET MAINTENANCE ||============================== //

const CountryMaintenance = () => {
	const theme = useTheme();
	const [openPanel, setOpenPanel] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState({ mode: null, id: null });

	const handleCountryForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.View:
				setSelectedCountry({ mode: OPERATION_MODE.View, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Edit:
				setSelectedCountry({ mode: OPERATION_MODE.Edit, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Delete:
				setSelectedCountry({ mode: OPERATION_MODE.Delete, id: record });
				setOpenDeleteModal(true);
				break;

			default:
				setSelectedCountry({ mode: OPERATION_MODE.Create, id: null });
				setOpenPanel(true);
				break;
		}
	};
	return (
		<>
			{/* COMMAND BAR SECTION */}
			<>
				<Stack spacing={2}>
					<Stack direction='row' justifyContent='space-between'  alignItems='flex-start'>
					<Breadcrumbs navigation={navigation} />
						<Button variant='contained' color='primary' onClick={handleCountryForm}>
							New Country
						</Button>
					</Stack>
				</Stack>
			</>
			{/* COMMAND BAR SECTION */}

			{/* CABINET GRID SECTION */}
			<>
			<MainCard>
				<CountryList handleCountryForm={handleCountryForm} />
			</MainCard>
			</>
			{/* CABINET GRID SECTION */}

			{/* CABINET FORM SECTION */}
			<>
				<CountryProvider>
					<Country
						openPanel={openPanel}
						setOpenPanel={setOpenPanel}
						openDeleteModal={openDeleteModal}
						setOpenDeleteModal={setOpenDeleteModal}
						selectedCountry={selectedCountry}
						setSelectedCountry={setSelectedCountry}
					/>
				</CountryProvider>
			</>
			{/* CABINET FORM SECTION */}
		</>
	);
};

export default CountryMaintenance;
