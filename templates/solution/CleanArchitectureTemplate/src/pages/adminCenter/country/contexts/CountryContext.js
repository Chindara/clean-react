import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const CountryContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { COUNTRY_STATE } from 'common/state/country-state';

// ==============================|| COMPANY CONTEXT & PROVIDER ||============================== //

export function CountryProvider({ children }) {
	const [country, setCountry] = useState(COUNTRY_STATE);
	const [prevCountry, setPrevCountry] = useState(COUNTRY_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetCountryForm = () => {
		setCountry(COUNTRY_STATE);
		setPrevCountry(COUNTRY_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<CountryContext.Provider
			value={{
				country,
				setCountry,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevCountry,
				setPrevCountry,
				resetCountryForm,
			}}
		>
			{children}
		</CountryContext.Provider>
	);
}

export const useCountry = () => useContext(CountryContext);

CountryProvider.propTypes = {
	children: PropTypes.node,
};
