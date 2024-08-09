import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Box, Container, Toolbar } from '@mui/material';

// project import
import Drawer from './Drawer';
import Header from './Header';
import Footer from './Footer';
import HorizontalBar from 'containers/drawer/drawer-horizontal/HorizontalBar';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

import navigation from 'containers/menu-items';

import useConfig from 'hooks/useConfig';
import { openDrawer } from 'store/reducers/menu';
import { LAYOUT_CONST } from '../config';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
	const theme = useTheme();
	const matchDownLG = useMediaQuery(theme.breakpoints.down('xl'));
	const downLG = useMediaQuery(theme.breakpoints.down('lg'));

	const { container, miniDrawer, menuOrientation } = useConfig();
	const dispatch = useDispatch();

	const menu = useSelector((state) => state.menu);
	const { drawerOpen, officerView } = menu;

	const isHorizontal = menuOrientation === LAYOUT_CONST.HORIZONTAL_LAYOUT && !downLG;

	// drawer toggler
	const [open, setOpen] = useState(!miniDrawer || drawerOpen);
	const handleDrawerToggle = () => {
		setOpen(!open);
		dispatch(openDrawer({ drawerOpen: !open }));
	};

	// set media wise responsive drawer
	useEffect(() => {
		if (!miniDrawer) {
			setOpen(!matchDownLG);
			dispatch(openDrawer({ drawerOpen: !matchDownLG }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [matchDownLG]);

	useEffect(() => {
		if (open !== drawerOpen) {
			if (!miniDrawer) {
				setOpen(true);
				dispatch(openDrawer({ drawerOpen: true }));
			}

			if (miniDrawer) {
				setOpen(false);
				dispatch(openDrawer({ drawerOpen: !drawerOpen }));
				setTimeout(() => dispatch(openDrawer({ drawerOpen: false })), 20);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [drawerOpen]);

	return (
		<Box sx={{ display: 'flex', width: '100%' }}>
			<Header open={open} handleDrawerToggle={handleDrawerToggle} />
			{!officerView && !isHorizontal ? <Drawer open={open} handleDrawerToggle={handleDrawerToggle} /> : !officerView && <HorizontalBar />}
			<Box component='main' sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
				<Toolbar sx={{ mt: isHorizontal ? 8 : 'inherit' }} />
				<Container
					maxWidth={container ? 'xl' : false}
					sx={{
						...(container && { px: { xs: 0, sm: 2 } }),
						position: 'relative',
						minHeight: 'calc(100vh - 110px)',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					{/* {!officerView && <Breadcrumbs navigation={navigation} title titleBottom card={false} divider={false} />} */}
					<Outlet />
					<Footer />
				</Container>
			</Box>
		</Box>
	);
};

export default MainLayout;
