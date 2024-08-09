import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

// MUI
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Stack } from '@mui/material';

// ASSETS
import { UserAddOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import navigation from 'containers/menu-items';
import breadcrumbItems from 'containers/menu-items/breadcrumbs';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// PROJECT IMPORT

// CONTEXTS
//import { PurchaseOrderProvider } from './contexts/PurchaseOrderContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { BulkUploadProvider } from './contexts/BulkUploadContext';
import IconButton from 'components/@extended/IconButton';
import BulkUpload from './views/features/BulkUpload';

const BulkUploadFormMaintenance = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const [selectedBulkUploadForm, setSelectedBulkUploadForm] = useState({
		mode: Number(searchParams.get('mode')),
		id: searchParams.get('id'),
	});

	return (
		<>
			<Stack spacing={2}>
				<Stack direction='row' alignItems='flex-start' justifyContent='space-between'>
					<Breadcrumbs navigation={breadcrumbItems} />
					<IconButton
						aria-label='back'
						onClick={() => {
							navigate(`..`);
						}}
					>
						<FaArrowAltCircleLeft style={{ fontSize: '1.2rem' }} />
					</IconButton>
				</Stack>
			</Stack>
			<MainCard>
				<BulkUploadProvider>
					<BulkUpload selectedBulkUpload={selectedBulkUploadForm} setSelectedPurchaseOrder={setSelectedBulkUploadForm} />
				</BulkUploadProvider>
			</MainCard>
		</>
	);
};

export default BulkUploadFormMaintenance;
