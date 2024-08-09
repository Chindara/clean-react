import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Stack } from '@mui/material';
import IconButton from 'components/@extended/IconButton';
import { FaArrowAltCircleLeft } from 'react-icons/fa';

import { PurchaseOrderHistoryProvider } from './contexts/HistoryContext';
import PurchaseOrderHistory from './views/features/PurchaseOrderHistory';

import breadcrumbItems from 'containers/menu-items/breadcrumbs';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

const PurchaseOrderHistoryMaintenance = () => {
	const navigate = useNavigate();

	return (
		<>
			<Stack spacing={2}>
				<Stack direction='row' alignItems='flex-start' justifyContent='space-between'>
					<Breadcrumbs navigation={breadcrumbItems} />
					<IconButton aria-label='back' onClick={() => navigate(`..`)}>
						<FaArrowAltCircleLeft style={{ fontSize: '1.2rem' }} />
					</IconButton>
				</Stack>
			</Stack>

			<PurchaseOrderHistoryProvider>
				<PurchaseOrderHistory />
			</PurchaseOrderHistoryProvider>
		</>
	);
};

export default PurchaseOrderHistoryMaintenance;
