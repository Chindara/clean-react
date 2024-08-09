import React, { useState } from 'react';
import { IconButton, Stack } from '@mui/material';
import navigation from 'containers/menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';

import OutStandingBankGuarantee from './features/OutstandingBankGuarantee';

const OutStandingBankGuaranteeReport = () => {
	const [searchVisible, setSearchVisible] = useState(true);

	const handleSearchBar = () => {
		setSearchVisible(!searchVisible);
	};

	return (
		<>
			<Stack spacing={2}>
				<Stack direction='row' alignItems='flex-start' justifyContent='space-between' sx={{ height: '48px' }}>
					<Breadcrumbs navigation={navigation} />
				</Stack>
			</Stack>
			<MainCard>
				<OutStandingBankGuarantee searchVisible={searchVisible} setSearchVisible={setSearchVisible} />
			</MainCard>
		</>
	);
};

export default OutStandingBankGuaranteeReport;
