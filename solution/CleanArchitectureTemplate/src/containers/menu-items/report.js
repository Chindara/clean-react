import React from 'react';

// third-party
import { FormattedMessage } from 'react-intl';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { FUNCTIONS } from 'constants/Common';

const icons = {
	ArticleOutlinedIcon,
};

const report = {
	id: 'group-report',
	icon: icons.ArticleOutlinedIcon,
	type: 'group',
	children: [
		{
			id: 'report',
			title: <FormattedMessage id='report' />,
			type: 'collapse',
			icon: icons.ArticleOutlinedIcon,
			children: [
				{
					id: FUNCTIONS.TotalShipmentRegisterReport,
					title: <FormattedMessage id='totalShipmentRegister' />,
					type: 'item',
					url: '/report/totalShipmentRegister',
				},
				{
					id: FUNCTIONS.PurchaseOrderReport,
					title: <FormattedMessage id='purchaseOrder' />,
					type: 'item',
					url: '/report/purchaseOrder',
				},
				{
					id: FUNCTIONS.UnderCustomsClearanceReport,
					title: <FormattedMessage id='underCustomsClearance' />,
					type: 'item',
					url: '/report/underCustomsClearance',
				},
				{
					id: FUNCTIONS.OutstandingTTReport,
					title: <FormattedMessage id='outstandingTT' />,
					type: 'item',
					url: '/report/outstandingTT',
				},
				{
					id: FUNCTIONS.OpenAccountPaymentReport,
					title: <FormattedMessage id='openAccountPayment' />,
					type: 'item',
					url: '/report/openAccountPayment',
				},
				{
					id: FUNCTIONS.OutstandingShippingGuaranteeReport,
					title: <FormattedMessage id='outstandingShippingGuarantee' />,
					type: 'item',
					url: '/report/outstandingShippingGuarantee',
				},
				{
					id: FUNCTIONS.OutstandingBankGuaranteeReport,
					title: <FormattedMessage id='outstandingBankGuarantee' />,
					type: 'item',
					url: '/report/outstandingBankGuarantee',
				},
				{
					id: FUNCTIONS.CustomsClearanceLeadTimeReport,
					title: <FormattedMessage id='customClearance' />,
					type: 'item',
					url: '/report/customClearance',
				},
				{
					id: FUNCTIONS.TotalCostReport,
					title: <FormattedMessage id='totalCost' />,
					type: 'item',
					url: '/report/totalCost',
				},
				{
					id: FUNCTIONS.LogisticsInvoiceReport,
					title: <FormattedMessage id='logisticsInvoice' />,
					type: 'item',
					url: '/report/logisticsInvoice',
				},
				{
					id: FUNCTIONS.DutyUpdateReport,
					title: <FormattedMessage id='dutyUpdate' />,
					type: 'item',
					url: '/report/dutyUpdate',
				},
				{
					id: FUNCTIONS.DemurrageReport,
					title: <FormattedMessage id='demurrage' />,
					type: 'item',
					url: '/report/demurrage',
				},
				{
					id: FUNCTIONS.ContainerDepositReport,
					title: <FormattedMessage id='containerDeposit' />,
					type: 'item',
					url: '/report/containerDeposit',
				},
				{
					id: FUNCTIONS.InsuranceReport,
					title: <FormattedMessage id='insurance' />,
					type: 'item',
					url: '/report/insurance',
				},
			],
		},
	],
};

export default report;
