import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const CompanyContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { ASSIGN_USER_STATE, COMPANY_STATE } from 'common/state/company-state';

// ==============================|| COMPANY CONTEXT & PROVIDER ||============================== //

export function CompanyProvider({ children }) {
	const [company, setCompany] = useState(COMPANY_STATE);
	const [prevCompany, setPrevCompany] = useState(COMPANY_STATE);
	const [assignUser, setAssignUser] = useState(ASSIGN_USER_STATE);
	const [prevAssignUser, setPrevAssignUser] = useState(ASSIGN_USER_STATE);
	//const [prevUser, setPrevUser] = useState(COMPANY_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);
	const [availability, setAvailability] = useState({ cabinetNameExists: false });

	const resetCompanyForm = () => {
		setCompany(COMPANY_STATE);
		setPrevCompany(COMPANY_STATE);
		//setUser(COMPANY_STATE);
		//setPrevUser(COMPANY_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
		setAvailability({ cabinetNameExists: false });
	};

	const resetAssignUserForm = () => {
		setAssignUser(ASSIGN_USER_STATE);
		setPrevAssignUser(ASSIGN_USER_STATE);
		//setUser(COMPANY_STATE);
		//setPrevUser(COMPANY_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.AssignUser);
		setAvailability({ cabinetNameExists: false });
	};

	return (
		<CompanyContext.Provider
			value={{
				company,
				setCompany,
				assignUser,
				setAssignUser,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				availability,
				setAvailability,
				prevAssignUser,
				setPrevAssignUser,
				prevCompany,
				setPrevCompany,
				resetCompanyForm,
				resetAssignUserForm,
			}}
		>
			{children}
		</CompanyContext.Provider>
	);
}

export const useCompany = () => useContext(CompanyContext);

CompanyProvider.propTypes = {
	children: PropTypes.node,
};
