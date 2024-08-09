import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, useMediaQuery } from '@mui/material';

// project import
import DrawerHeader from 'containers/drawer/drawer-header/DrawerHeader';
import DrawerContent from 'containers/drawer/drawer-content/DrawerContent';
import MiniDrawerStyled from 'containers/drawer/drawer-styles/MiniDrawerStyled';
import { DRAWER_WIDTH } from '../config';

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

const MainDrawer = ({ open, handleDrawerToggle, window }) => {
	const theme = useTheme();
	const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

	// responsive drawer container
	const container = window !== undefined ? () => window().document.body : undefined;

	// header content
	const drawerContent = useMemo(() => <DrawerContent />, []);
	const drawerHeader = useMemo(() => <DrawerHeader open={open} />, [open]);

	return (
		<Box component='nav' sx={{ flexShrink: { md: 0 }, zIndex: 1200 }} aria-label='mailbox folders'>
			{!matchDownMD ? (
				<MiniDrawerStyled variant='permanent' open={open}>
					{drawerHeader}
					{drawerContent}
				</MiniDrawerStyled>
			) : (
				<Drawer
					container={container}
					variant='temporary'
					open={open}
					onClose={handleDrawerToggle}
					ModalProps={{ keepMounted: true }}
					sx={{
						display: { xs: 'block', lg: 'none' },
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: DRAWER_WIDTH,
							borderRight: `1px solid ${theme.palette.divider}`,
							backgroundImage: 'none',
							boxShadow: 'inherit',
						},
					}}
				>
					{drawerHeader}
					{drawerContent}
				</Drawer>
			)}
		</Box>
	);
};

MainDrawer.propTypes = {
	open: PropTypes.bool,
	window: PropTypes.object,
	handleDrawerToggle: PropTypes.func,
};

export default MainDrawer;
