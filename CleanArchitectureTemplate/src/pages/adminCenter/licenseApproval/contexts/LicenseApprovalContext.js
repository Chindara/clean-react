import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const LicenseApproval = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { LICENSE_APPROVAL_STATE } from 'common/state/licenseApproval-state';

// ==============================|| COMPANY CONTEXT & PROVIDER ||============================== //

export function LicenseApprovalProvider({ children }) {
	const [licenseApproval, setLicenseApproval] = useState(LICENSE_APPROVAL_STATE);
	const [prevLicenseApproval, setPrevLicenseApproval] = useState(LICENSE_APPROVAL_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetLicenseApprovalForm = () => {
		setLicenseApproval(LICENSE_APPROVAL_STATE);
		setPrevLicenseApproval(LICENSE_APPROVAL_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<LicenseApproval.Provider
			value={{
				licenseApproval,
				setLicenseApproval,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevLicenseApproval,
				setPrevLicenseApproval,
				resetLicenseApprovalForm,
			}}
		>
			{children}
		</LicenseApproval.Provider>
	);
}

export const useLicenseApproval = () => useContext(LicenseApproval);

LicenseApprovalProvider.propTypes = {
	children: PropTypes.node,
};
