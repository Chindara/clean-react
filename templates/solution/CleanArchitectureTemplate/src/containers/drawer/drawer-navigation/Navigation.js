import React, { useEffect, useMemo, useState } from 'react';

// MUI
import { useTheme } from '@mui/material/styles';
import { Box, Typography, useMediaQuery } from '@mui/material';

import { useSelector } from 'store';
import useConfig from 'hooks/useConfig';
import { HORIZONTAL_MAX_ITEM, LAYOUT_CONST } from '../../../config';

// PROJECT IMPORT
import NavGroup from './NavGroup';
import menuItem from 'containers/menu-items';
import { authFunctionHandler } from '../../../helpers/AuthHelper';
import { FUNCTIONS } from 'constants/Common';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
	const theme = useTheme();

	const downLG = useMediaQuery(theme.breakpoints.down('lg'));

	const { menuOrientation } = useConfig();
	const { drawerOpen, userFunctions, purchaseBased } = useSelector((state) => state.menu);
	const [selectedItems, setSelectedItems] = useState('');
	const [selectedLevel, setSelectedLevel] = useState(0);

	useEffect(() => {
		// handlerMenuItem();
		// eslint-disable-next-line
	}, []);

	const filteredUserFunctions = purchaseBased
		? userFunctions.filter((item) => item.id !== FUNCTIONS.NonPoShipment)
		: userFunctions.filter((item) => item.id !== FUNCTIONS.Shipment).filter((item) => item.id !== FUNCTIONS.PurchaseOrder);

	const authorizedMenuItems = useMemo(() => authFunctionHandler(filteredUserFunctions, menuItem.items), [filteredUserFunctions]);

	const isHorizontal = menuOrientation === LAYOUT_CONST.HORIZONTAL_LAYOUT && !downLG;

	const lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;
	let lastItemIndex = authorizedMenuItems.length - 1;
	let remItems = [];
	let lastItemId;

	if (lastItem && lastItem < authorizedMenuItems.length) {
		lastItemId = authorizedMenuItems[lastItem - 1].id;
		lastItemIndex = lastItem - 1;
		remItems = authorizedMenuItems.slice(lastItem - 1, authorizedMenuItems.length).map((item) => ({
			title: item.title,
			elements: item.children,
			icon: item.icon,
		}));
	}

	const navGroups = authorizedMenuItems.slice(0, lastItemIndex + 1).map((item) => {
		switch (item.type) {
			case 'group':
				return (
					<NavGroup
						key={item.id}
						setSelectedItems={setSelectedItems}
						setSelectedLevel={setSelectedLevel}
						selectedLevel={selectedLevel}
						selectedItems={selectedItems}
						lastItem={lastItem}
						remItems={remItems}
						lastItemId={lastItemId}
						item={item}
					/>
				);
			default:
				return (
					<Typography key={item.id} variant='h6' color='error' align='center'>
						Fix - Navigation Group
					</Typography>
				);
		}
	});

	return (
		<Box
			sx={{
				pt: drawerOpen ? (isHorizontal ? 0 : 2) : 0,
				'& > ul:first-of-type': { mt: 0 },
				display: isHorizontal ? { xs: 'block', lg: 'flex' } : 'block',
			}}
		>
			{navGroups}
		</Box>
	);
};

export default Navigation;
