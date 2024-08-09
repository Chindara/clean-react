import { useMemo } from 'react';

// MUI
import { Box, useMediaQuery } from '@mui/material';

// PROJECT IMPORT
import Search from './Search';
import Message from './Message';
import Profile from '../header-profile/Profile';

import Localization from './Localization';
import Notification from './Notification';
import Customization from '../header-customization/Customization';

import MobileSection from './MobileSection';
import MegaMenuSection from './MegaMenuSection';

import useConfig from 'hooks/useConfig';
import DrawerHeader from '../../drawer/drawer-header/DrawerHeader';
import { LAYOUT_CONST } from '../../../config';
import { useSelector } from 'store';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
	const { i18n, menuOrientation } = useConfig();
	const { officerView } = useSelector((state) => state.menu);

	const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const localization = useMemo(() => <Localization />, [i18n]);

	const megaMenu = useMemo(() => <MegaMenuSection />, []);

	return (
		<>
			{!officerView && menuOrientation === LAYOUT_CONST.HORIZONTAL_LAYOUT && !downLG && <DrawerHeader open={true} />}
			{/* {!officerView ? !downLG && <Search /> : <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }} />} */}
			<Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }} />
			{/* {!officerView && !downLG && megaMenu}
			{!officerView && !downLG && localization} */}
			{downLG && <Box sx={{ width: '100%', ml: 1 }} />}

			{/* {!officerView && <Notification />} */}
			{/* {!officerView && <Message />} */}
			<Customization />
			{!downLG && <Profile />}
			{downLG && <MobileSection />}
		</>
	);
};

export default HeaderContent;
