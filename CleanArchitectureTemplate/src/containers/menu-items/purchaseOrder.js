import React from 'react';

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import { FUNCTIONS } from 'constants/Common';

// icons
const icons = {
	ReceiptOutlinedIcon,
};

const purchaseOrder = {
	id: 'group-purchaseOrder',
	icon: icons.BookOutlined,
	type: 'group',
	children: [
		{
			id: FUNCTIONS.PurchaseOrder,
			title: <FormattedMessage id='purchaseOrders' />,
			type: 'item',
			icon: icons.ReceiptOutlinedIcon,
			url: '/purchaseOrders',
		},
	],
};

export default purchaseOrder;
