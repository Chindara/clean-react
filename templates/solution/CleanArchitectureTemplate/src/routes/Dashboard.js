import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

const LoadableDashboardMaintenance = Loadable(lazy(() => import('pages/dashboard')));
// const LoadableDashboardList = Loadable(lazy(() => import('pages/dashboard/DashboardList')));

const Dashboard = {
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
					path: 'dashboard',
					children: [
						{ index: true, element: <LoadableDashboardMaintenance /> },
						// { path: 'lists/DashboardList', element: <LoadableDashboardList /> },
						// { index: true, element: <LoadableDashboardMaintenance /> },
					],
				},
			],
		},
	],
};

export default Dashboard;
