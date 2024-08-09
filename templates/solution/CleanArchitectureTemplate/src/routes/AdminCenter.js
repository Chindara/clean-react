import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import { FUNCTIONS } from 'constants/Common';
import FunctionGuard from 'utils/route-guard/FunctionGuard';

const CompanyMaintenance = Loadable(lazy(() => import('pages/adminCenter/company/CompanyMaintenance')));
const CurrencyMaintenance = Loadable(lazy(() => import('pages/adminCenter/currency/CurrencyMaintenance')));
const EntityMaintenance = Loadable(lazy(() => import('pages/adminCenter/entity/EntityMaintenance')));
const PaymentMaintenance = Loadable(lazy(() => import('pages/adminCenter/payment/PaymentMaintenance')));
const CountryMaintenance = Loadable(lazy(() => import('pages/adminCenter/country/CountryMaintenance')));
const VendorMaintenance = Loadable(lazy(() => import('pages/adminCenter/vendor/VendorMaintenance')));
const IncotermMaintenance = Loadable(lazy(() => import('pages/adminCenter/incoterm/IncotermMaintenance')));
const UserMaintenance = Loadable(lazy(() => import('pages/adminCenter/user/UserMaintenance')));
const RoleMaintenance = Loadable(lazy(() => import('pages/adminCenter/role/RoleMaintenance')));
const BankMaintenance = Loadable(lazy(() => import('pages/adminCenter/bank/BankMaintenance')));
const ClearingAgentMaintenance = Loadable(lazy(() => import('pages/adminCenter/clearingAgent/ClearingAgentMaintenance')));
const LicenseApprovalMaintenance = Loadable(lazy(() => import('pages/adminCenter/licenseApproval/LicenseApprovalMaintenance')));
const ShipmentCostCategoryMaintenance = Loadable(lazy(() => import('pages/adminCenter/shipmentCostCategory/ShipmentCostCategoryMaintenance')));
const ShipmentPaymentTypeMaintenance = Loadable(lazy(() => import('pages/adminCenter/shipmentPaymentType/ShipmentPaymentTypeMaintenance')));
const BeneficiaryMaintenance = Loadable(lazy(() => import('pages/adminCenter/beneficiary/BeneficiaryMaintenance')));
const PortMaintenance = Loadable(lazy(() => import('pages/adminCenter/port/PortMaintenance')));
const PaymentTypeMaintenance = Loadable(lazy(() => import('pages/adminCenter/paymentType/PaymentTypeMaintenance')));
const SubPaymentMethodMaintenance = Loadable(lazy(() => import('pages/adminCenter/subPaymentMethod/SubPaymentMethodMaintenance')));
const NatureOfPurchaseMaintenance = Loadable(lazy(() => import('pages/adminCenter/natureOfPurchase/NatureOfPurchaseMaintenance')));
const HsCodeMaintenance = Loadable(lazy(() => import('pages/adminCenter/hsCode/HsCodeMaintenance')));

const AdminCenter = {
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
					path: 'adminCenter',
					children: [
						{
							path: 'company',
							element: (
								<FunctionGuard functionId={FUNCTIONS.Company}>
									<CompanyMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'currency',
							element: (
								<FunctionGuard functionId={FUNCTIONS.Currency}>
									<CurrencyMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'entity',
							element: (
								<FunctionGuard functionId={FUNCTIONS.Entity}>
									<EntityMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'country',
							element: (
								<FunctionGuard functionId={FUNCTIONS.Country}>
									<CountryMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'vendor',
							element: (
								<FunctionGuard functionId={FUNCTIONS.Vendor}>
									<VendorMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'port',
							element: (
								<FunctionGuard functionId={FUNCTIONS.Port}>
									<PortMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'incoterm',
							element: (
								<FunctionGuard functionId={FUNCTIONS.IncoTerm}>
									<IncotermMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'user',
							element: (
								<FunctionGuard functionId={FUNCTIONS.User}>
									<UserMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'role',
							element: (
								<FunctionGuard functionId={FUNCTIONS.Role}>
									<RoleMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'bank',
							element: (
								<FunctionGuard functionId={FUNCTIONS.Bank}>
									<BankMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'clearingAgent',
							element: (
								<FunctionGuard functionId={FUNCTIONS.ClearingAgent}>
									<ClearingAgentMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'licenseApproval',
							element: (
								<FunctionGuard functionId={FUNCTIONS.LicenseApproval}>
									<LicenseApprovalMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'shipmentCostCategory',
							element: (
								<FunctionGuard functionId={FUNCTIONS.ShipmentCostCategory}>
									<ShipmentCostCategoryMaintenance />
								</FunctionGuard>
							),
						},
						// {
						// 	path: 'shipmentPayment',
						// 	element: (
						// 		<FunctionGuard functionId={FUNCTIONS.ShipmentPaymnet}>
						// 			<ShipmentPaymentMaintenance />
						// 		</FunctionGuard>
						// 	),
						// },
						{
							path: 'beneficiary',
							element: (
								<FunctionGuard functionId={FUNCTIONS.Beneficiary}>
									<BeneficiaryMaintenance />
								</FunctionGuard>
							),
						},

						{
							path: 'natureOfPurchase',
							element: (
								<FunctionGuard functionId={FUNCTIONS.NatureOfPurchase}>
									<NatureOfPurchaseMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'paymentType',
							element: (
								<FunctionGuard functionId={FUNCTIONS.PaymentType}>
									<PaymentTypeMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'subPaymentMethod',
							element: (
								<FunctionGuard functionId={FUNCTIONS.PaymentMethod}>
									<SubPaymentMethodMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'shipmentPaymentType',
							element: (
								<FunctionGuard functionId={FUNCTIONS.ShipmentPaymentType}>
									<ShipmentPaymentTypeMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'hsCode',
							element: (
								<FunctionGuard functionId={FUNCTIONS.HSCode}>
									<HsCodeMaintenance />
								</FunctionGuard>
							),
						},
					],
				},
			],
		},
	],
};

export default AdminCenter;
