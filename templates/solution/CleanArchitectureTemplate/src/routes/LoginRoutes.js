import React, { lazy } from 'react';
import { Outlet } from 'react-router-dom';
// PROJECT IMPORT
import Loadable from 'components/Loadable';
import GuestGuard from 'utils/route-guard/GuestGuard';
import AuthGuard from 'utils/route-guard/AuthGuard';

// render - login
const Login = Loadable(lazy(() => import('pages/auth/login/LoginForm')));
const ChangePassword = Loadable(lazy(() => import('pages/auth/change-password/ChangePassword')));

// ==============================|| AUTH ROUTING ||============================== //

// const LoginRoutes = {
// 	path: '/login',
// 	element: (
// 		<GuestGuard>
// 			<Login />
// 		</GuestGuard>
// 	),
// };

const LoginRoutes = {
	path: '/',
	element: (
		<GuestGuard>
			<Outlet />
		</GuestGuard>
	),
	children: [
		{
			path: 'login',
			element: <Login />,
		},
		{
			path: 'change-password',
			element: <ChangePassword />,
		},
	],
};

export default LoginRoutes;
