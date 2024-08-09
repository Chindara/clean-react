import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const NatureOfPurchaseContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { NATURE_STATE } from 'common/state/nature-state';

// ==============================|| COMPANY CONTEXT & PROVIDER ||============================== //

export function NatureOfPurchaseProvider({ children }) {
	const [natureOfPurchase, setNatureOfPurchase] = useState(NATURE_STATE);
	const [prevNatureOfPurchase, setPrevNatureOfPurchase] = useState(NATURE_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetNatureOfPurchaseForm = () => {
		setNatureOfPurchase(NATURE_STATE);
		setPrevNatureOfPurchase(NATURE_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<NatureOfPurchaseContext.Provider
			value={{
				natureOfPurchase,
				setNatureOfPurchase,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevNatureOfPurchase,
				setPrevNatureOfPurchase,
				resetNatureOfPurchaseForm,
			}}
		>
			{children}
		</NatureOfPurchaseContext.Provider>
	);
}

export const useNatureOfPurchase = () => useContext(NatureOfPurchaseContext);

NatureOfPurchaseProvider.propTypes = {
	children: PropTypes.node,
};
