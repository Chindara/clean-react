import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import FunctionGuard from 'utils/route-guard/FunctionGuard';
import { FUNCTIONS } from 'constants/Common';

const NonPoShipmentListMaintenance = Loadable(lazy(() => import('pages/nonPoShipment/NonPoShipmentsListMaintenance')));
const NonPoShipmentFormMaintenance = Loadable(lazy(() => import('pages/nonPoShipment/NonPoShipmentFormMaintenance')));
const NonPoShipmentGuaranteesMaintenance = Loadable(lazy(() => import('pages/nonPoShipment/NonPoShipmentGuaranteesMaintenance')));
const NonPOShipmentDutyMaintenance = Loadable(lazy(() => import('pages/nonPoShipment/NonPoShipmentDutyMaintenance')));
const NonPoShipmentLogisticsInvoiceMaintenance = Loadable(lazy(() => import('pages/nonPoShipment/NonPoShipmentLogisticsInvoiceMaintenance')));

const nonPoShipments = {
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
					path: 'nonPoShipments',
					children: [
						{
							index: true,
							element: (
								<FunctionGuard functionId={FUNCTIONS.NonPoShipment}>
									<NonPoShipmentListMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'form',
							element: (
								<FunctionGuard functionId={FUNCTIONS.NonPoShipment}>
									<NonPoShipmentFormMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'guarantee',
							element: (
								<FunctionGuard functionId={FUNCTIONS.Guarantees}>
									<NonPoShipmentGuaranteesMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'logisticsInvoice',
							element: (
								<FunctionGuard functionId={FUNCTIONS.LogisticsInvoices}>
									<NonPoShipmentLogisticsInvoiceMaintenance />
								</FunctionGuard>
							),
						},
						{
							path: 'duty',
							element: (
								<FunctionGuard functionId={FUNCTIONS.Duty}>
									<NonPOShipmentDutyMaintenance />
								</FunctionGuard>
							),
						},
					],
				},
			],
		},
	],
};

export default nonPoShipments;
