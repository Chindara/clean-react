import React, { useState } from 'react';

// MUI
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Stack } from '@mui/material';

// ASSETS
import { UserAddOutlined } from '@ant-design/icons';

// PROJECT IMPORT
import GuaranteeCategoryList from './views/lists/GuaranteeCategoryList';
import GuaranteeCategory from './views/features/GuaranteeCategory';
import navigation from 'containers/menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';

// CONTEXTS
import { GuaranteeCategoryProvider } from './contexts/GuaranteeCategoryContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';

// ==============================|| CABINET MAINTENANCE ||============================== //

const GuaranteeCategoryMaintenance = () => {
	const theme = useTheme();
	const [openPanel, setOpenPanel] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedGuaranteeCategory, setSelectedGuaranteeCategory] = useState({ mode: null, id: null });

	const handleGuaranteeCategoryForm = (mode, record) => {
		switch (mode) {
			case OPERATION_MODE.View:
				setSelectedGuaranteeCategory({ mode: OPERATION_MODE.View, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Edit:
				setSelectedGuaranteeCategory({ mode: OPERATION_MODE.Edit, id: record });
				setOpenPanel(true);
				break;

			case OPERATION_MODE.Delete:
				setSelectedGuaranteeCategory({ mode: OPERATION_MODE.Delete, id: record });
				setOpenDeleteModal(true);
				break;

			default:
				setSelectedGuaranteeCategory({ mode: OPERATION_MODE.Create, id: null });
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
						<Button variant='contained' color='primary' onClick={handleGuaranteeCategoryForm}>
							New Guarantee Category
						</Button>
					</Stack>
				</Stack>
			</>
			{/* COMMAND BAR SECTION */}

			{/* CABINET GRID SECTION */}
			<>
			<MainCard>
				<GuaranteeCategoryList handleGuaranteeCategoryForm={handleGuaranteeCategoryForm} />
			</MainCard>
			</>
			{/* CABINET GRID SECTION */}

			{/* CABINET FORM SECTION */}
			<>
				<GuaranteeCategoryProvider>
					<GuaranteeCategory
						openPanel={openPanel}
						setOpenPanel={setOpenPanel}
						openDeleteModal={openDeleteModal}
						setOpenDeleteModal={setOpenDeleteModal}
						selectedGuaranteeCategory={selectedGuaranteeCategory}
						setSelectedGuaranteeCategory={setSelectedGuaranteeCategory}
					/>
				</GuaranteeCategoryProvider>
			</>
			{/* CABINET FORM SECTION */}
		</>
	);
};

export default GuaranteeCategoryMaintenance;
