import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import FunctionGuard from 'utils/route-guard/FunctionGuard';
import { FUNCTIONS } from 'constants/Common';

const PurchaseOrderListMaintenance = Loadable(lazy(() => import('pages/purchaseOrder/PurchaseOrderListMaintenance')));
const PurchaseOrderFormMaintenance = Loadable(lazy(() => import('pages/purchaseOrder/PurchaseOrderFormMaintenance')));
const BulkUploadFormMaintenance = Loadable(lazy(() => import('pages/purchaseOrder/BulkUploadFormMaintenance')));
const PurchaseOrderBankMaintenance = Loadable(lazy(() => import('pages/purchaseOrder/PurchaseOrderBankMaintenance')));
const PurchaseOrderHistoryMaintenance = Loadable(lazy(() => import('pages/purchaseOrder/PurchaseOrderHistoryMaintenance')));

const PurchaseOrder = {
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
					path: 'purchaseOrders',
					children: [
						{
							index: true,
							element: (
								<FunctionGuard functionId={FUNCTIONS.PurchaseOrder}>
									<PurchaseOrderListMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'form',
							element: (
								<FunctionGuard functionId={FUNCTIONS.PurchaseOrder}>
									<PurchaseOrderFormMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'bulkUpload/form',
							element: (
								<FunctionGuard functionId={FUNCTIONS.PurchaseOrder}>
									<BulkUploadFormMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'bank/:purchaseOrderId',
							element: (
								<FunctionGuard functionId={FUNCTIONS.PurchaseOrderBank}>
									<PurchaseOrderBankMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'History/:purchaseOrderId',
							element: (
								<FunctionGuard functionId={FUNCTIONS.PurchaseOrderHistory}>
									<PurchaseOrderHistoryMaintenance />
								</FunctionGuard>
							),
						},
					],
				},
			],
		},
	],
};

export default PurchaseOrder;
