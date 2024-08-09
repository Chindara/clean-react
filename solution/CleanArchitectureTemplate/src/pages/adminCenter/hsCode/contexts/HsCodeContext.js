import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const HsCodeContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { HS_CODE_STATE } from 'common/state/hsCode-state';

// ==============================|| COMPANY CONTEXT & PROVIDER ||============================== //

export function HsCodeProvider({ children }) {
	const [hsCode, setHsCode] = useState(HS_CODE_STATE);
	const [prevHsCode, setPrevHsCode] = useState(HS_CODE_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetHsCodeForm = () => {
		setHsCode(HS_CODE_STATE);
		setPrevHsCode(HS_CODE_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<HsCodeContext.Provider
			value={{
				hsCode,
				setHsCode,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevHsCode,
				setPrevHsCode,
				resetHsCodeForm,
			}}
		>
			{children}
		</HsCodeContext.Provider>
	);
}

export const useHsCode = () => useContext(HsCodeContext);

HsCodeProvider.propTypes = {
	children: PropTypes.node,
};
