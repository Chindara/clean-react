import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { PURCHASE_ORDER_BANK_STATE } from 'common/state/bank-state';
import { OPERATION_MODE } from 'constants/Types';

const PurchaseOrderBankContext = createContext({});

export function PurchaseOrderBankProvider({ children }) {
	const [purchaseOrderBank, setPurchaseOrderBank] = useState(PURCHASE_ORDER_BANK_STATE);
	const [prevPurchaseOrderBank, setPrevPurchaseOrderBank] = useState(PURCHASE_ORDER_BANK_STATE);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);
	const [loader, setLoader] = useState(false);

	const resetPurchaseOrderBankForm = () => {
		setPurchaseOrderBank(PURCHASE_ORDER_BANK_STATE);
		setPrevPurchaseOrderBank(PURCHASE_ORDER_BANK_STATE);
		setError([]);
		setMode(OPERATION_MODE.Create);
		setLoader(false);
	};

	return (
		<PurchaseOrderBankContext.Provider
			value={{
				purchaseOrderBank,
				setPurchaseOrderBank,
				prevPurchaseOrderBank,
				setPrevPurchaseOrderBank,
				error,
				setError,
				mode,
				setMode,
				loader,
				setLoader,
				resetPurchaseOrderBankForm,
			}}
		>
			{children}
		</PurchaseOrderBankContext.Provider>
	);
}

export const usePurchaseOrderBank = () => useContext(PurchaseOrderBankContext);

PurchaseOrderBankProvider.propTypes = {
	children: PropTypes.node,
};
