import React from 'react';

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { FUNCTIONS } from 'constants/Common';

// icons
const icons = {
	DashboardOutlinedIcon,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
	id: 'group-dashboard',
	icon: icons.DashboardOutlined,
	type: 'group',
	children: [
		{
			id: FUNCTIONS.Dashboard,
			title: <FormattedMessage id='dashboard' />,
			type: 'item',
			icon: icons.DashboardOutlinedIcon,
			url: '/dashboard',
		},
	],
};

export default dashboard;
