import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Button, Stack, IconButton } from '@mui/material';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import PurchaseOrderList from './views/lists/PurchaseOrderList';
import { OPERATION_MODE } from 'constants/Types';
import { Grid } from '@mui/material';
import navigation from 'containers/menu-items';
import breadcrumbItems from 'containers/menu-items/breadcrumbs';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';
import { CONTROL_SIZE } from 'constants/Common';

const PurchaseOrderMaintenance = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const [searchVisible, setSearchVisible] = useState(false);

	const handleSearchBar = () => {
		setSearchVisible(!searchVisible);
	};

	return (
		<>
			<Stack spacing={2}>
				<Stack sx={{ height: '40px' }} direction='row' alignItems='flex-start' justifyContent='space-between'>
					<Breadcrumbs navigation={breadcrumbItems} />
					<Stack direction='row' alignItems='center' justifyContent='flex-start' spacing={1}>
						<Button
							variant='contained'
							color='primary'
							size={CONTROL_SIZE}
							onClick={() => {
								navigate(`/purchaseOrders/form?mode=${OPERATION_MODE.Create}`);
							}}
						>
							New Purchase Order
						</Button>
						<Button
							variant='contained'
							color='primary'
							size={CONTROL_SIZE}
							onClick={() => {
								navigate(`/purchaseOrders/bulkUpload/form?mode=${OPERATION_MODE.Create}`);
							}}
						>
							Bulk Upload
						</Button>
						<IconButton color='primary' size={CONTROL_SIZE} onClick={handleSearchBar}>
							<FilterListOutlinedIcon />
						</IconButton>
					</Stack>
				</Stack>
			</Stack>

			<MainCard>
				<PurchaseOrderList searchVisible={searchVisible} setSearchVisible={setSearchVisible} />
			</MainCard>
		</>
	);
};

export default PurchaseOrderMaintenance;
