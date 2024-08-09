import React from 'react';
import { FormattedMessage } from 'react-intl';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import { FUNCTIONS } from 'constants/Common';

const icons = {
	ReceiptOutlinedIcon,
};

const breadcrumbs = {
	items: [
		{
			id: 'group-purchase',
			icon: icons.BookOutlined,
			type: 'group',
			children: [
				{
					id: FUNCTIONS.PurchaseOrder,
					title: <FormattedMessage id='purchaseOrders' />,
					type: 'item',
					icon: icons.ReceiptOutlinedIcon,
					url: '/purchaseOrders',
					children: [
						{
							id: FUNCTIONS.PurchaseOrder,
							title: <FormattedMessage id='purchaseForm' />,
							type: 'item',
							icon: icons.ReceiptOutlinedIcon,
							url: '/purchaseOrders/form',
						},
						{
							id: FUNCTIONS.PurchaseOrderBank,
							title: <FormattedMessage id='purchaseBank' />,
							type: 'item',
							icon: icons.ReceiptOutlinedIcon,
							url: '/purchaseOrders/bank/:id',
						},
						{
							id: FUNCTIONS.PurchaseOrderHistory,
							title: <FormattedMessage id='purchaseHistory' />,
							type: 'item',
							icon: icons.ReceiptOutlinedIcon,
							url: '/purchaseOrders/history/:id',
						},
						{
							id: FUNCTIONS.PurchaseOrderHistory,
							title: <FormattedMessage id='bulkUpload' />,
							type: 'item',
							icon: icons.ReceiptOutlinedIcon,
							url: '/purchaseOrders/bulkUpload/form',
						},
					],
				},
			],
		},
		{
			id: 'group-shipment',
			icon: icons.BookOutlined,
			type: 'group',
			children: [
				{
					id: FUNCTIONS.Shipment,
					title: <FormattedMessage id='shipments' />,
					type: 'item',
					icon: icons.ReceiptOutlinedIcon,
					url: '/shipment',
					children: [
						{
							id: FUNCTIONS.Shipment,
							title: <FormattedMessage id='shipmentForm' />,
							type: 'item',
							icon: icons.ReceiptOutlinedIcon,
							url: '/shipment/form',
						},
						{
							id: FUNCTIONS.Guarantees,
							title: <FormattedMessage id='guarantees' />,
							type: 'item',
							icon: icons.ReceiptOutlinedIcon,
							url: '/shipment/guarantee',
						},
						{
							id: FUNCTIONS.LogisticsInvoices,
							title: <FormattedMessage id='logisticsInvoices' />,
							type: 'item',
							icon: icons.ReceiptOutlinedIcon,
							url: '/shipment/logisticsInvoice',
						},
						{
							id: FUNCTIONS.Duty,
							title: <FormattedMessage id='shipmentDuty' />,
							type: 'item',
							icon: icons.ReceiptOutlinedIcon,
							url: '/shipment/duty',
						},
					],
				},
			],
		},
		{
			id: 'group-nonPoShipment',
			icon: icons.BookOutlined,
			type: 'group',
			children: [
				{
					id: FUNCTIONS.NonPoShipment,
					title: <FormattedMessage id='nonPoShipments' />,
					type: 'item',
					icon: icons.ReceiptOutlinedIcon,
					url: '/nonPoShipments',
					children: [
						{
							id: FUNCTIONS.NonPoShipment,
							title: <FormattedMessage id='nonPoShipmentForm' />,
							type: 'item',
							icon: icons.ReceiptOutlinedIcon,
							url: '/nonPoShipments/form',
						},
						{
							id: FUNCTIONS.LogisticsInvoices,
							title: <FormattedMessage id='logisticsInvoices' />,
							type: 'item',
							icon: icons.ReceiptOutlinedIcon,
							url: '/nonPoShipments/logisticsInvoice',
						},
						{
							id: FUNCTIONS.Duty,
							title: <FormattedMessage id='shipmentDuty' />,
							type: 'item',
							icon: icons.ReceiptOutlinedIcon,
							url: '/nonPoShipments/duty',
						},
						{
							id: FUNCTIONS.Guarantees,
							title: <FormattedMessage id='guarantees' />,
							type: 'item',
							icon: icons.ReceiptOutlinedIcon,
							url: '/nonPoShipments/guarantee',
						},
					],
				},
			],
		},
		{
			id: 'group-dashboard',
			icon: icons.ReceiptOutlinedIcon,
			type: 'group',
			children: [
				{
					id: FUNCTIONS.Dashboard,
					title: <FormattedMessage id='dashboard' />,
					type: 'item',
					icon: icons.ReceiptOutlinedIcon,
					url: '/dashboard',
				},
			],
		},
	],
};

export default breadcrumbs;
