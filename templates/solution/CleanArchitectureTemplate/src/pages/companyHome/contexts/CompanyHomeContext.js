import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { COMPANY_HOMES_STATE, COMPANY_HOME_STATE } from 'common/state/companyHome-state';
import { OPERATION_MODE } from 'constants/Types';

const CompanyHomeContext = createContext({});

export function CompanyHomeProvider({ children }) {
	const [companyHome, setCompanyHome] = useState(COMPANY_HOME_STATE);
	const [companyHomes, setCompanyHomes] = useState([]);
	const [error, setError] = useState([]);
	const [loader, setLoader] = useState(false);

	return (
		<CompanyHomeContext.Provider
			value={{
				companyHome,
				setCompanyHome,
				companyHomes,
				setCompanyHomes,
				error,
				setError,
				loader,
				setLoader,
			}}
		>
			{children}
		</CompanyHomeContext.Provider>
	);
}

export const useCompanyHome = () => useContext(CompanyHomeContext);

CompanyHomeProvider.propTypes = {
	children: PropTypes.node,
};
