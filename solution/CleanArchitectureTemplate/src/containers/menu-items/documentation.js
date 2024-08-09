import React from 'react';

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { FUNCTIONS } from 'constants/Common';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

// icons
const icons = {
	HelpOutlineOutlinedIcon,
};

const documentation = {
	id: 'group-documentation',
	icon: icons.BookOutlined,
	type: 'group',
	children: [
		{
			id: FUNCTIONS.Documentation,
			title: <FormattedMessage id='documentation' />,
			type: 'item',
			icon: icons.HelpOutlineOutlinedIcon,
			url: '/help/index.htm',
			external: true,
			target: true,
		},
	],
};

export default documentation;
