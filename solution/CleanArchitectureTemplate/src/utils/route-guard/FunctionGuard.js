import React from 'react';
import PropTypes from 'prop-types';

// PROJECT IMPORT
import { useSelector } from 'store';

// ==============================|| AUTH GUARD ||============================== //

const FunctionGuard = ({ functionId, children }) => {
	const { userFunctions } = useSelector((state) => state.menu);

	const functionIds = userFunctions.map((x) => x?.id);

	const hasAccess = functionIds.includes(functionId);

	if (!hasAccess) return <>Access Denied</>;

	return <>{children}</>;
};

FunctionGuard.propTypes = {
	functionId: PropTypes.number,
	children: PropTypes.node,
};

export default FunctionGuard;
