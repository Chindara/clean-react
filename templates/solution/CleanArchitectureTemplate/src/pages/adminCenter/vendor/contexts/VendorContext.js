import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const VendorContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { VENDOR_STATE } from 'common/state/vendor-state';

// ==============================|| COMPANY CONTEXT & PROVIDER ||============================== //

export function VendorProvider({ children }) {
	const [vendor, setVendor] = useState(VENDOR_STATE);
	const [prevVendor, setPrevVendor] = useState(VENDOR_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetVendorForm = () => {
		setVendor(VENDOR_STATE);
		setPrevVendor(VENDOR_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<VendorContext.Provider
			value={{
				vendor,
				setVendor,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevVendor,
				setPrevVendor,
				resetVendorForm,
			}}
		>
			{children}
		</VendorContext.Provider>
	);
}

export const useVendor = () => useContext(VendorContext);

VendorProvider.propTypes = {
	children: PropTypes.node,
};
