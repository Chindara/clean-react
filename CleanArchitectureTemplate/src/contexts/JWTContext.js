import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';

// third-party
// import { Chance } from 'chance';
import { jwtDecode } from 'jwt-decode';

// reducer - state management
import { CHANGE_COMPANY, LOGIN, LOGOUT, RESET } from 'store/reducers/actions';
import authReducer from 'store/reducers/auth';

// project import
import Loader from 'components/Loader';
import axios from './../lib/axios-config';
import AuthService from 'services/AuthService';
import { LOGGED_STATE } from 'common/state/logged-state';
import { CHANGE_PASSWORD_STATUS, LOGGED_USER_STATUS, USER_TYPE } from 'constants/Types';

import { changeOfficerView, setCompanyName, setUserCredentials, setUserFunctions, setUserType } from 'store/reducers/menu';
import { dispatch as storeDispatch } from 'store';
import { FUNCTIONS } from 'constants/Common';

const verifyToken = (serviceToken) => {
	if (!serviceToken) {
		return false;
	}
	const decoded = jwtDecode(serviceToken);

	return decoded && true;
};

const setSession = (companyId, userId, isLogin, fullName, serviceToken, userType, userCompanies, functions, status) => {
	if (serviceToken) {
		localStorage.setItem('companyId', companyId);
		localStorage.setItem('parentId', companyId);
		localStorage.setItem('userId', userId);
		localStorage.setItem('isLogin', isLogin);
		localStorage.setItem('fullName', fullName);
		localStorage.setItem('serviceToken', serviceToken);
		localStorage.setItem('userType', userType);
		localStorage.setItem('userCompanies', JSON.stringify(userCompanies));
		localStorage.setItem('functions', JSON.stringify(functions));
		localStorage.setItem('status', status);
		axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
	} else {
		localStorage.removeItem('companyId');
		localStorage.removeItem('parentId');
		localStorage.removeItem('userId');
		localStorage.removeItem('isLogin');
		localStorage.removeItem('fullName');
		localStorage.removeItem('serviceToken');
		localStorage.removeItem('userType');
		localStorage.removeItem('userCompanies');
		localStorage.removeItem('functions');
		localStorage.removeItem('status');
		delete axios.defaults.headers.common.Authorization;
	}
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, LOGGED_STATE);

	useEffect(() => {
		const init = async () => {
			try {
				const serviceToken = window.localStorage.getItem('serviceToken');
				if (serviceToken && verifyToken(serviceToken)) {
					const companyId = window.localStorage.getItem('companyId');
					const companyName = window.localStorage.getItem('companyName');
					const userId = window.localStorage.getItem('userId');
					const isLogin = window.localStorage.getItem('isLogin');
					const fullName = window.localStorage.getItem('fullName');
					const userType = window.localStorage.getItem('userType');
					const userCompanies = JSON.parse(window.localStorage.getItem('userCompanies'));
					const functions = JSON.parse(window.localStorage.getItem('functions'));
					const status = JSON.parse(window.localStorage.getItem('status'));

					setSession(companyId, userId, isLogin, fullName, serviceToken, userType, userCompanies, functions, status);

					dispatch({
						type: LOGIN,
						payload: {
							isLogin: true,
							token: serviceToken,
							fullName,
							userId,
							companyId,
							message: '',
							userType,
							userCompanies,
							functions,
							status,
						},
					});

					// onChangeOfficerView(userType === USER_TYPE.OFFICER);

					storeDispatch(changeOfficerView({ officerView: userType === USER_TYPE.OFFICER }));
					storeDispatch(setUserFunctions({ userFunctions: [{ id: FUNCTIONS.Dashboard, name: 'Dashboard' }, ...(functions || [])] }));
					storeDispatch(setUserType({ userType: userType }));
					storeDispatch(setCompanyName({ companyName: companyName }));
				} else {
					dispatch({
						type: LOGOUT,
					});
				}
			} catch (err) {
				console.error(err);
				dispatch({
					type: LOGOUT,
				});
			}
		};

		init();
	}, []);

	const login = async (email, password) => {
		const response = await AuthService.login({
			userName: email,
			passWord: password,
		});

		console.log(response);

		const { isLogin, token, fullName, userId, companyId, userType, userCompanies, functions, status } = response;
		setSession(companyId, userId, isLogin, fullName, token, userType, userCompanies, functions, status);

		// storeDispatch(changeOfficerView({ officerView: userType === USER_TYPE.OFFICER }));
		storeDispatch(changeOfficerView({ officerView: userType === USER_TYPE.OFFICER }));
		storeDispatch(setUserFunctions({ userFunctions: [{ id: FUNCTIONS.Dashboard, name: 'Dashboard' }, ...(functions || [])] }));
		storeDispatch(setUserType({ userType: userType }));

		if (CHANGE_PASSWORD_STATUS.includes(Number(status))) storeDispatch(setUserCredentials({ userCredentials: { companyId, username: email, password: password } }));

		dispatch({
			type: LOGIN,
			payload: {
				...response,
			},
		});
	};

	const logout = () => {
		setSession(null, null, null, null, null, null, null, null, null);
		dispatch({ type: LOGOUT });
	};

	const resetAuth = async () => {
		setSession(null, null, null, null, null, null, null, null, null);
		dispatch(setUserCredentials({ userCredentials: {} }));
		dispatch({ type: RESET });
	};

	const updateProfile = () => {};

	const changeUserCompany = (companyId, companyName) => {
		localStorage.setItem('companyId', companyId);
		localStorage.setItem('companyName', companyName);

		dispatch({ type: CHANGE_COMPANY, payload: { companyId } });
	};

	if (state.isInitialized !== undefined && !state.isInitialized) {
		return <Loader />;
	}

	return <JWTContext.Provider value={{ ...state, login, logout, resetAuth, updateProfile, changeUserCompany }}>{children}</JWTContext.Provider>;
};

JWTProvider.propTypes = {
	children: PropTypes.node,
};

export default JWTContext;
