import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// project import
import { APP_DEFAULT_PATH } from '../../config';
import useAuth from 'hooks/useAuth';
import { useSelector } from 'store';
import { CHANGE_PASSWORD_STATUS, LOGGED_USER_STATUS, USER_TYPE } from 'constants/Types';

// ==============================|| GUEST GUARD ||============================== //

const GuestGuard = ({ children }) => {
	const navigate = useNavigate();
	const { isLogin, status } = useAuth();
	const { userType, userCredentials } = useSelector((state) => state.menu);

	const handleNavigation = useMemo(() => {
		if (!isLogin) return () => navigate('/login', { replace: true });

		if (Number(status) === LOGGED_USER_STATUS.Active) {
			const path = Number(userType) === USER_TYPE.OFFICER ? APP_DEFAULT_PATH : '/dashboard';
			return () => navigate(path, { replace: true });
		}

		if (CHANGE_PASSWORD_STATUS.includes(Number(status))) {
			if (!userCredentials || !Object.values(userCredentials)?.length) {
				return () => navigate('/login', { replace: true });
			}

			return () => navigate('/change-password', { state: { ...userCredentials }, replace: true });
		}
	}, [isLogin, status, userCredentials, userType, navigate]);

	useEffect(() => {
		if (handleNavigation) handleNavigation();
	}, [handleNavigation]);

	return children;
};

GuestGuard.propTypes = {
	children: PropTypes.node,
};

export default GuestGuard;
