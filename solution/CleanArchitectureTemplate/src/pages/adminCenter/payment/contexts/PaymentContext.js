import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const PaymentContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { PAYMENT_STATE } from 'common/state/payment-state';

// ==============================|| PAYMENT CONTEXT & PROVIDER ||============================== //

export function PaymentProvider({ children }) {
	const [payment, setPayment] = useState(PAYMENT_STATE);
	const [prevPayment, setPrevPayment] = useState(PAYMENT_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetPaymentForm = () => {
		setPayment(PAYMENT_STATE);
		setPrevPayment(PAYMENT_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<PaymentContext.Provider
			value={{
				payment,
				setPayment,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevPayment,
				setPrevPayment,
				resetPaymentForm,
			}}
		>
			{children}
		</PaymentContext.Provider>
	);
}

export const usePayment = () => useContext(PaymentContext);

PaymentProvider.propTypes = {
	children: PropTypes.node,
};
