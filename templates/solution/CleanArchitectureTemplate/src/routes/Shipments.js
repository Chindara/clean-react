import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import FunctionGuard from 'utils/route-guard/FunctionGuard';
import { FUNCTIONS } from 'constants/Common';

const ShipmentsListMaintenance = Loadable(lazy(() => import('pages/shipments/ShipmentsListMaintenance')));
const ShipmentFormMaintenance = Loadable(lazy(() => import('pages/shipments/ShipmentsFormMaintenance')));
const ShipmentLogisticsInvoiceMaintenance = Loadable(lazy(() => import('pages/shipments/ShipmentLogisticsInvoiceMaintenance')));
//const GuaranteeMaintenance = Loadable(lazy(() => import('pages/shipments/ShipmentGuaranteeMaintenance')));
const GuaranteesMaintenance = Loadable(lazy(() => import('pages/shipments/ShipmentGuaranteesMaintenance')));
const ShipmentDutyMaintenance = Loadable(lazy(() => import('pages/shipments/ShipmentDutyMaintenance')));

const Shipment = {
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
					path: 'shipment',
					children: [
						{
							index: true,
							element: (
								<FunctionGuard functionId={FUNCTIONS.Shipment}>
									<ShipmentsListMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'guarantee',
							element: (
								<FunctionGuard functionId={FUNCTIONS.Guarantees}>
									<GuaranteesMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'form',
							element: (
								<FunctionGuard functionId={FUNCTIONS.Shipment}>
									<ShipmentFormMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'logisticsInvoice',
							element: (
								<FunctionGuard functionId={FUNCTIONS.LogisticsInvoices}>
									<ShipmentLogisticsInvoiceMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'duty',
							element: (
								<FunctionGuard functionId={FUNCTIONS.Duty}>
									<ShipmentDutyMaintenance />
								</FunctionGuard>
							),
						},
					],
				},
			],
		},
	],
};

export default Shipment;
