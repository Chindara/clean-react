import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const RoleContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { ROLE_STATE } from 'common/state/role-state';

// ==============================|| ROLE CONTEXT & PROVIDER ||============================== //

export function RoleProvider({ children }) {
	const [role, setRole] = useState(ROLE_STATE);
	const [prevRole, setPrevRole] = useState(ROLE_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetRoleForm = () => {
		setRole(ROLE_STATE);
		setPrevRole(ROLE_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<RoleContext.Provider
			value={{
				role,
				setRole,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevRole,
				setPrevRole,
				resetRoleForm,
			}}
		>
			{children}
		</RoleContext.Provider>
	);
}

export const useRole = () => useContext(RoleContext);

RoleProvider.propTypes = {
	children: PropTypes.node,
};
