import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { PURCHASE_ORDER_HISTORIES_STATE, PURCHASE_ORDER_HISTORY_STATE } from 'common/state/purchaseOrder-state';
import { OPERATION_MODE } from 'constants/Types';

const PurchaseOrderHistoryContext = createContext({});

export function PurchaseOrderHistoryProvider({ children }) {
	const [purchaseOrderHistory, setPurchaseOrderHistory] = useState(PURCHASE_ORDER_HISTORY_STATE);
	const [purchaseOrderHistories, setPurchaseOrderHistories] = useState([]);
	const [error, setError] = useState([]);
	const [loader, setLoader] = useState(false);

	const resetPurchaseOrderHistoryForm = () => {
		setPurchaseOrderHistory(PURCHASE_ORDER_HISTORIES_STATE);
		setPurchaseOrderHistories([]);
		setError([]);
		setLoader(false);
	};

	return (
		<PurchaseOrderHistoryContext.Provider
			value={{
				purchaseOrderHistory,
				setPurchaseOrderHistory,
				purchaseOrderHistories,
				setPurchaseOrderHistories,
				error,
				setError,
				loader,
				setLoader,
				resetPurchaseOrderHistoryForm,
			}}
		>
			{children}
		</PurchaseOrderHistoryContext.Provider>
	);
}

export const usePurchaseOrderHistory = () => useContext(PurchaseOrderHistoryContext);

PurchaseOrderHistoryProvider.propTypes = {
	children: PropTypes.node,
};
