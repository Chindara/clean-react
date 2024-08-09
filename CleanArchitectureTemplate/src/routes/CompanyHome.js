import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

const CompanyHomeListMaintenance = Loadable(lazy(() => import('pages/companyHome/CompanyHomeListMaintenance')));

const CompanyHome = {
	path: '/',
	element: (
		<AuthGuard>
			<MainLayout />
		</AuthGuard>
	),
	children: [
		{
			path: 'company-homes',
			children: [{ index: true, element: <CompanyHomeListMaintenance /> }],
		},
	],
};

export default CompanyHome;
