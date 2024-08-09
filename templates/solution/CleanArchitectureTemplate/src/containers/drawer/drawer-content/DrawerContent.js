import React from 'react';
import { useSelector } from 'react-redux';

// MUI
import { useMediaQuery, useTheme } from '@mui/material';

// PROJECT IMPORT
import NavCard from './NavCard';
import Navigation from '../drawer-navigation/Navigation';
import SimpleBar from 'components/third-party/SimpleBar';

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => {
	const theme = useTheme();
	const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

	const { drawerOpen } = useSelector((state) => state.menu);

	return (
		<SimpleBar
			sx={{
				'& .simplebar-content': {
					display: 'flex',
					flexDirection: 'column',
				},
			}}
		>
			<Navigation />
			{/* {drawerOpen && !matchDownMD && <NavCard />} */}
		</SimpleBar>
	);
};

export default DrawerContent;
