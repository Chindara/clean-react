import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const CurrencyContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { CURRENCY_STATE } from 'common/state/currency-state';

// ==============================|| COMPANY CONTEXT & PROVIDER ||============================== //

export function CurrencyProvider({ children }) {
	const [currency, setCurrency] = useState(CURRENCY_STATE);
	const [prevCurrency, setPrevCurrency] = useState(CURRENCY_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetCurrencyForm = () => {
		setCurrency(CURRENCY_STATE);
		setPrevCurrency(CURRENCY_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<CurrencyContext.Provider
			value={{
				currency,
				setCurrency,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevCurrency,
				setPrevCurrency,
				resetCurrencyForm,
			}}
		>
			{children}
		</CurrencyContext.Provider>
	);
}

export const useCurrency = () => useContext(CurrencyContext);

CurrencyProvider.propTypes = {
	children: PropTypes.node,
};
