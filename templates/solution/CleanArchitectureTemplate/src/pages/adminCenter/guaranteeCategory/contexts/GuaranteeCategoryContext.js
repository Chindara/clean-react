import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const GuaranteeCategory = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { GUARANTEE_CATEGORY_STATE } from 'common/state/guaranteeCategory-state';

// ==============================|| COMPANY CONTEXT & PROVIDER ||============================== //

export function GuaranteeCategoryProvider({ children }) {
	const [guaranteeCategory, setGuaranteeCategory] = useState(GUARANTEE_CATEGORY_STATE);
	const [prevGuaranteeCategory, setPrevGuaranteeCategory] = useState(GUARANTEE_CATEGORY_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetGuaranteeCategory = () => {
		setGuaranteeCategory(GUARANTEE_CATEGORY_STATE);
		setPrevGuaranteeCategory(GUARANTEE_CATEGORY_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<GuaranteeCategory.Provider
			value={{
				guaranteeCategory,
				setGuaranteeCategory,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevGuaranteeCategory,
				setPrevGuaranteeCategory,
				resetGuaranteeCategory,
			}}
		>
			{children}
		</GuaranteeCategory.Provider>
	);
}

export const useGuaranteeCategory = () => useContext(GuaranteeCategory);

GuaranteeCategoryProvider.propTypes = {
	children: PropTypes.node,
};
