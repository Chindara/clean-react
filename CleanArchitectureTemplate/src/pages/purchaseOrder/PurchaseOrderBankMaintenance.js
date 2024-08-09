import React from 'react';
import { useNavigate } from 'react-router-dom';

// ASSETS
import { FaArrowAltCircleLeft } from 'react-icons/fa';

// MUI
import { Stack } from '@mui/material';

// PROJECT IMPORT
import Bank from './views/features/Bank';
import IconButton from 'components/@extended/IconButton';
import breadcrumbItems from 'containers/menu-items/breadcrumbs';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';

// CONTEXTS
import { PurchaseOrderBankProvider } from './contexts/BankContext';

const PurchaseOrderBankMaintenance = () => {
	const navigate = useNavigate();

	return (
		<>
			<Stack spacing={2}>
				<Stack direction='row' justifyContent='space-between'>
					<Breadcrumbs navigation={breadcrumbItems} />
					<IconButton aria-label='back' onClick={() => navigate(`..`)}>
						<FaArrowAltCircleLeft style={{ fontSize: '1.2rem' }} />
					</IconButton>
				</Stack>
			</Stack>
			<MainCard>
				<PurchaseOrderBankProvider>
					<Bank />
				</PurchaseOrderBankProvider>
			</MainCard>
		</>
	);
};

export default PurchaseOrderBankMaintenance;
