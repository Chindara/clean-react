import React from 'react';

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
	LineChartOutlined,
	IdcardOutlined,
	DatabaseOutlined,
	TeamOutlined,
	UserAddOutlined,
	HddOutlined,
	LockOutlined,
} from '@ant-design/icons';
import { TbTextRecognition } from 'react-icons/tb';

// icons
const icons = {
	LineChartOutlined,
	IdcardOutlined,
	DatabaseOutlined,
	TeamOutlined,
	UserAddOutlined,
	HddOutlined,
	LockOutlined,
	TbTextRecognition,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const widget = {
	id: 'maintenance',
	title: <FormattedMessage id='maintenance' />,
	icon: icons.IdcardOutlined,
	type: 'group',
	children: [
		{
			id: 3,
			title: <FormattedMessage id='Users' />,
			type: 'item',
			url: '/maintenance/users',
			icon: icons.IdcardOutlined,
		},
		{
			id: 4,
			title: <FormattedMessage id='Groups' />,
			type: 'item',
			url: '/maintenance/groups',
			icon: icons.TeamOutlined,
		},
		{
			id: 5,
			title: <FormattedMessage id='Roles' />,
			type: 'item',
			url: '/maintenance/roles',
			icon: icons.UserAddOutlined,
		},
		{
			id: 6,
			title: <FormattedMessage id='Cabinets' />,
			type: 'item',
			url: '/maintenance/cabinets',
			icon: icons.HddOutlined,
			children: [
				{
					id: 7,
					title: <FormattedMessage id='Indexes' />,
					type: 'item',
					url: '/maintenance/cabinets/indexes/:cabinetId',
					icon: icons.HddOutlined,
					children: [
						{
							id: 8,
							title: <FormattedMessage id='Lookups' />,
							type: 'item',
							url: '/maintenance/cabinets/indexes/:cabinetId/lookups/:lookupId',
							icon: icons.HddOutlined,
						},
					],
				},
			],
		},
		{
			id: 9,
			title: <FormattedMessage id='Controls' />,
			type: 'item',
			url: '/maintenance/controls',
			icon: icons.LockOutlined,
		},
		{
			id: 10,
			title: <FormattedMessage id='OCR' />,
			type: 'item',
			url: '/maintenance/OCR',
			icon: icons.TbTextRecognition,
		},
	],
};

export default widget;
