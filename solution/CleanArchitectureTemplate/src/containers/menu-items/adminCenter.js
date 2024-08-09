import React from 'react';

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { FUNCTIONS } from 'constants/Common';

// icons
const icons = {
	SettingsOutlinedIcon,
};

const adminCenter = {
	id: 'group-adminCenter',
	icon: icons.SettingsOutlinedIcon,
	type: 'group',
	children: [
		{
			id: 'adminCenter',
			title: <FormattedMessage id='adminCenter' />,
			type: 'collapse',
			icon: icons.SettingsOutlinedIcon,
			children: [
				{
					id: FUNCTIONS.Company,
					title: <FormattedMessage id='company' />,
					type: 'item',
					url: '/adminCenter/company',
				},
				{
					id: FUNCTIONS.Role,
					title: <FormattedMessage id='role' />,
					type: 'item',
					url: '/adminCenter/role',
				},
				{
					id: FUNCTIONS.User,
					title: <FormattedMessage id='user' />,
					type: 'item',
					url: '/adminCenter/user',
				},
				{
					id: FUNCTIONS.Bank,
					title: <FormattedMessage id='bank' />,
					type: 'item',
					url: '/adminCenter/bank',
				},
				{
					id: FUNCTIONS.Beneficiary,
					title: <FormattedMessage id='beneficiary' />,
					type: 'item',
					url: '/adminCenter/beneficiary',
				},
				{
					id: FUNCTIONS.ClearingAgent,
					title: <FormattedMessage id='clearingAgent' />,
					type: 'item',
					url: '/adminCenter/clearingAgent',
				},
				{
					id: FUNCTIONS.Country,
					title: <FormattedMessage id='country' />,
					type: 'item',
					url: '/adminCenter/country',
				},
				{
					id: FUNCTIONS.Currency,
					title: <FormattedMessage id='currency' />,
					type: 'item',
					url: '/adminCenter/currency',
				},
				{
					id: FUNCTIONS.Entity,
					title: <FormattedMessage id='entity' />,
					type: 'item',
					url: '/adminCenter/entity',
				},
				{
					id: FUNCTIONS.HSCode,
					title: <FormattedMessage id='hsCode' />,
					type: 'item',
					url: '/adminCenter/hsCode',
				},
				{
					id: FUNCTIONS.IncoTerm,
					title: <FormattedMessage id='incoterm' />,
					type: 'item',
					url: '/adminCenter/incoterm',
				},
				{
					id: FUNCTIONS.LicenseApproval,
					title: <FormattedMessage id='licenseApproval' />,
					type: 'item',
					url: '/adminCenter/licenseApproval',
				},
				{
					id: FUNCTIONS.NatureOfPurchase,
					title: <FormattedMessage id='natureOfPurchase' />,
					type: 'item',
					url: '/adminCenter/natureOfPurchase',
				},
				{
					id: FUNCTIONS.Port,
					title: <FormattedMessage id='port' />,
					type: 'item',
					url: '/adminCenter/port',
				},
				{
					id: FUNCTIONS.ShipmentCostCategory,
					title: <FormattedMessage id='shipmentCostCategory' />,
					type: 'item',
					url: '/adminCenter/shipmentCostCategory',
				},
				{
					id: FUNCTIONS.ShipmentPaymentType,
					title: <FormattedMessage id='shipmentPaymentType' />,
					type: 'item',
					url: '/adminCenter/shipmentPaymentType',
				},
				{
					id: FUNCTIONS.PaymentMethod,
					title: <FormattedMessage id='subPaymentMethod' />,
					type: 'item',
					url: '/adminCenter/subPaymentMethod',
				},
				{
					id: FUNCTIONS.Vendor,
					title: <FormattedMessage id='vendor' />,
					type: 'item',
					url: '/adminCenter/vendor',
				},
			],
		},
	],
};

export default adminCenter;
