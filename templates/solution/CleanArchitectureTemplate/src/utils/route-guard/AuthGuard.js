import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// project import
import useAuth from 'hooks/useAuth';

// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }) => {
	const navigate = useNavigate();
	const { isLogin } = useAuth();

	useEffect(() => {
		if (!isLogin) {
			navigate('login', { replace: true });
		}
	}, [isLogin, navigate]);

	if (isLogin) return children;
};

AuthGuard.propTypes = {
	children: PropTypes.node,
};

export default AuthGuard;
