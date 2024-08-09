import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const SubPaymentMethodContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { SUB_PAYMENT_METHOD_STATE } from 'common/state/subPaymentMethod-state';

// ==============================|| COMPANY CONTEXT & PROVIDER ||============================== //

export function SubPaymentMethodProvider({ children }) {
	const [subPaymentMethod, setSubPaymentMethod] = useState(SUB_PAYMENT_METHOD_STATE);
	const [prevSubPaymentMethod, setPrevSubPaymentMethod] = useState(SUB_PAYMENT_METHOD_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetSubPaymentMethodForm = () => {
		setSubPaymentMethod(SUB_PAYMENT_METHOD_STATE);
		setPrevSubPaymentMethod(SUB_PAYMENT_METHOD_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<SubPaymentMethodContext.Provider
			value={{
				subPaymentMethod,
				setSubPaymentMethod,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevSubPaymentMethod,
				setPrevSubPaymentMethod,
				resetSubPaymentMethodForm,
			}}
		>
			{children}
		</SubPaymentMethodContext.Provider>
	);
}

export const useSubPaymentMethod = () => useContext(SubPaymentMethodContext);

SubPaymentMethodProvider.propTypes = {
	children: PropTypes.node,
};
