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

const shipment = {
	id: 'group-shipment',
	icon: icons.BookOutlined,
	type: 'group',
	children: [
		{
			id: FUNCTIONS.Shipment,
			title: <FormattedMessage id='shipments' />,
			type: 'item',
			icon: icons.DirectionsBoatOutlinedIcon,
			url: '/shipment',
		},
	],
};

export default shipment;
