import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const BeneficiaryContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { BENEFICIARY_STATE } from 'common/state/beneficiary-state';

// ==============================|| COMPANY CONTEXT & PROVIDER ||============================== //

export function BeneficiaryProvider({ children }) {
	const [beneficiary, setBeneficiary] = useState(BENEFICIARY_STATE);
	const [prevBeneficiary, setPrevBeneficiary] = useState(BENEFICIARY_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetBeneficiaryForm = () => {
		setBeneficiary(BENEFICIARY_STATE);
		setPrevBeneficiary(BENEFICIARY_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<BeneficiaryContext.Provider
			value={{
				beneficiary,
				setBeneficiary,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevBeneficiary,
				setPrevBeneficiary,
				resetBeneficiaryForm,
			}}
		>
			{children}
		</BeneficiaryContext.Provider>
	);
}

export const useBeneficiary = () => useContext(BeneficiaryContext);

BeneficiaryProvider.propTypes = {
	children: PropTypes.node,
};
