import React from 'react';

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { DashboardOutlined, GoldOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';
import { FUNCTIONS } from 'constants/Common';
import DirectionsBoatOutlinedIcon from '@mui/icons-material/DirectionsBoatOutlined';

// icons
const icons = {
	DirectionsBoatOutlinedIcon,
};

const NonPoShipment = {
	id: 'group-nonPoShipment',
	icon: icons.BookOutlined,
	type: 'group',
	children: [
		{
			id: FUNCTIONS.NonPoShipment,
			title: <FormattedMessage id='nonPoShipments' />,
			type: 'item',
			icon: icons.DirectionsBoatOutlinedIcon,
			url: '/nonPoShipments',
		},
	],
};

export default NonPoShipment;
