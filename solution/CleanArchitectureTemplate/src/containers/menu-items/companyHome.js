import React from 'react';

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { DashboardOutlined, GoldOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';

// icons
const icons = {
	DashboardOutlined,
	GoldOutlined,
	UserOutlined,
	BookOutlined,
};

const companyHome = {
	id: 'group-company-homes',
	icon: icons.BookOutlined,
	type: 'group',
	children: [
		{
			id: 'company-homes',
			title: <FormattedMessage id='Company Homes' />,
			type: 'item',
			icon: icons.BookOutlined,
			url: '/company-homes',
		},
	],
};

export default companyHome;
