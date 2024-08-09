import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const PaymentTypeContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { NATURE_STATE } from 'common/state/nature-state';

// ==============================|| COMPANY CONTEXT & PROVIDER ||============================== //

export function PaymentTypeProvider({ children }) {
	const [paymentType, setPaymentType] = useState(NATURE_STATE);
	const [prevPaymentType, setPrevPaymentType] = useState(NATURE_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetPaymentTypeForm = () => {
		setPaymentType(NATURE_STATE);
		setPrevPaymentType(NATURE_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<PaymentTypeContext.Provider
			value={{
				paymentType,
				setPaymentType,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevPaymentType,
				setPrevPaymentType,
				resetPaymentTypeForm,
			}}
		>
			{children}
		</PaymentTypeContext.Provider>
	);
}

export const usePaymentType = () => useContext(PaymentTypeContext);

PaymentTypeProvider.propTypes = {
	children: PropTypes.node,
};
