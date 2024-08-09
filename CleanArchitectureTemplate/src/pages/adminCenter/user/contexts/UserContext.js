import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const UserContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { USER_STATE } from 'common/state/user-state';

// ==============================|| COMPANY CONTEXT & PROVIDER ||============================== //

export function UserProvider({ children }) {
	const [user, setUser] = useState(USER_STATE);
	const [prevUser, setPrevUser] = useState(USER_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetUserForm = () => {
		setUser(USER_STATE);
		setPrevUser(USER_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevUser,
				setPrevUser,
				resetUserForm,
			}}
		>
			{children}
		</UserContext.Provider>
	);
}

export const useUser = () => useContext(UserContext);

UserProvider.propTypes = {
	children: PropTypes.node,
};
