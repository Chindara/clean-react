import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const BankContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { BANK_STATE } from 'common/state/bank-state2';

// ==============================|| COMPANY CONTEXT & PROVIDER ||============================== //

export function BankProvider({ children }) {
	const [bank, setBank] = useState(BANK_STATE);
	const [prevBank, setPrevBank] = useState(BANK_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetBankForm = () => {
		setBank(BANK_STATE);
		setPrevBank(BANK_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<BankContext.Provider
			value={{
				bank,
				setBank,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevBank,
				setPrevBank,
				resetBankForm,
			}}
		>
			{children}
		</BankContext.Provider>
	);
}

export const useBank = () => useContext(BankContext);

BankProvider.propTypes = {
	children: PropTypes.node,
};
