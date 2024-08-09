import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import FunctionGuard from 'utils/route-guard/FunctionGuard';
import { FUNCTIONS } from 'constants/Common';

const TotalShipmentRegisterReport = Loadable(lazy(() => import('pages/reports/totalShipmentRegister/TotalShipmentRegisterReport')));
const TotalCostReport = Loadable(lazy(() => import('pages/reports/TotalCost/TotalCostReport')));
const OutstandingTTReport = Loadable(lazy(() => import('pages/reports/outstandingTTReport/OutstandingTTReport')));
const CustomClearanceReport = Loadable(lazy(() => import('pages/reports/customClearance/CustomClearanceReport')));
const PurchaseOrderReport = Loadable(lazy(() => import('pages/reports/purchaseOrder/PurchaseOrderReport')));
const OpenACReport = Loadable(lazy(() => import('pages/reports/openAC/OpenACReport')));
const OutStandingShippingGuaranteeReport = Loadable(lazy(() => import('pages/reports/outstandingShippingGuarantee/OutstandingShippingGuaranteeReport')));
const OutStandingBankGuaranteeReport = Loadable(lazy(() => import('pages/reports/outstandingBankGuarantee/OutstandingBankGuaranteeReport')));
const UnderCustomsClearanceReport = Loadable(lazy(() => import('pages/reports/underCustomsClearance/UnderCustomsClearanceReport')));
const LogisticsInvoiceReport = Loadable(lazy(() => import('pages/reports/logisticsInvoice/LogisticsInvoiceReport')));
const DutyUpdateReport = Loadable(lazy(() => import('pages/reports/dutyUpdate/DutyUpdateReport')));
const DemurrageReport = Loadable(lazy(() => import('pages/reports/demurrage/DemurrageReport')));
const ContainerDepositReport = Loadable(lazy(() => import('pages/reports/containerDeposit/ContainerDepositReport')));
const InsuranceReport = Loadable(lazy(() => import('pages/reports/insurance/InsuranceReport')));

const Report = {
	path: '/',
	children: [
		{
			path: '/',
			element: (
				<AuthGuard>
					<MainLayout />
				</AuthGuard>
			),
			children: [
				{
					path: 'report',
					children: [
						{
							path: 'totalShipmentRegister',
							element: (
								<FunctionGuard functionId={FUNCTIONS.TotalShipmentRegisterReport}>
									<TotalShipmentRegisterReport />
								</FunctionGuard>
							),
						},
						{
							path: 'totalCost',
							element: (
								<FunctionGuard functionId={FUNCTIONS.TotalCostReport}>
									<TotalCostReport />
								</FunctionGuard>
							),
						},
						{
							path: 'outstandingTT',
							element: (
								<FunctionGuard functionId={FUNCTIONS.OutstandingTTReport}>
									<OutstandingTTReport />
								</FunctionGuard>
							),
						},
						{
							path: 'customClearance',
							element: (
								<FunctionGuard functionId={FUNCTIONS.CustomsClearanceLeadTimeReport}>
									<CustomClearanceReport />
								</FunctionGuard>
							),
						},
						{
							path: 'underCustomsClearance',
							element: (
								<FunctionGuard functionId={FUNCTIONS.UnderCustomsClearanceReport}>
									<UnderCustomsClearanceReport />
								</FunctionGuard>
							),
						},
						{
							path: 'purchaseOrder',
							element: (
								<FunctionGuard functionId={FUNCTIONS.PurchaseOrderReport}>
									<PurchaseOrderReport />
								</FunctionGuard>
							),
						},
						{
							path: 'openAccountPayment',
							element: (
								<FunctionGuard functionId={FUNCTIONS.OpenAccountPaymentReport}>
									<OpenACReport />
								</FunctionGuard>
							),
						},
						{
							path: 'outstandingShippingGuarantee',
							element: (
								<FunctionGuard functionId={FUNCTIONS.OutstandingShippingGuaranteeReport}>
									<OutStandingShippingGuaranteeReport />
								</FunctionGuard>
							),
						},
						{
							path: 'outstandingBankGuarantee',
							element: (
								<FunctionGuard functionId={FUNCTIONS.OutstandingBankGuaranteeReport}>
									<OutStandingBankGuaranteeReport />
								</FunctionGuard>
							),
						},
						{
							path: 'logisticsInvoice',
							element: (
								<FunctionGuard functionId={FUNCTIONS.LogisticsInvoiceReport}>
									<LogisticsInvoiceReport />
								</FunctionGuard>
							),
						},
						{
							path: 'dutyUpdate',
							element: (
								<FunctionGuard functionId={FUNCTIONS.DutyUpdateReport}>
									<DutyUpdateReport />
								</FunctionGuard>
							),
						},
						{
							path: 'demurrage',
							element: (
								<FunctionGuard functionId={FUNCTIONS.DemurrageReport}>
									<DemurrageReport />
								</FunctionGuard>
							),
						},
						{
							path: 'containerDeposit',
							element: (
								<FunctionGuard functionId={FUNCTIONS.ContainerDepositReport}>
									<ContainerDepositReport />
								</FunctionGuard>
							),
						},
						{
							path: 'insurance',
							element: (
								<FunctionGuard functionId={FUNCTIONS.InsuranceReport}>
									<InsuranceReport />
								</FunctionGuard>
							),
						},
					],
				},
			],
		},
	],
};

export default Report;
