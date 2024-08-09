import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { DASHBOARD_STATE } from 'common/state/dashboard-state';
import { OPERATION_MODE } from 'constants/Types';

const DashboardContext = createContext({});

export function DashboardProvider({ children }) {
	const [dashboard, setDashboard] = useState(DASHBOARD_STATE);
	const [error, setError] = useState([]);
	const [loader, setLoader] = useState(false);

	return (
		<DashboardContext.Provider
			value={{
				dashboard,
				setDashboard,
				error,
				setError,
				loader,
				setLoader,
			}}
		>
			{children}
		</DashboardContext.Provider>
	);
}

export const useDashboard = () => useContext(DashboardContext);

DashboardProvider.propTypes = {
	children: PropTypes.node,
};
