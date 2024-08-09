import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { PURCHASE_ORDER_STATE } from 'common/state/purchaseOrder-state';
import { OPERATION_MODE } from 'constants/Types';

const PurchaseOrderContext = createContext({});

export function PurchaseOrderProvider({ children }) {
	const [purchaseOrder, setPurchaseOrder] = useState(PURCHASE_ORDER_STATE);
	const [prevPurchaseOrder, setPrevPurchaseOrder] = useState(PURCHASE_ORDER_STATE);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);
	const [loader, setLoader] = useState(false);

	const resetPurchaseOrderForm = () => {
		setPurchaseOrder(PURCHASE_ORDER_STATE);
		setPrevPurchaseOrder(PURCHASE_ORDER_STATE);
		setError([]);
		setMode(OPERATION_MODE.Create);
		setLoader(false);
	};

	return (
		<PurchaseOrderContext.Provider
			value={{
				purchaseOrder,
				setPurchaseOrder,
				prevPurchaseOrder,
				setPrevPurchaseOrder,
				error,
				setError,
				mode,
				setMode,
				loader,
				setLoader,
				resetPurchaseOrderForm,
			}}
		>
			{children}
		</PurchaseOrderContext.Provider>
	);
}

export const usePurchaseOrder = () => useContext(PurchaseOrderContext);

PurchaseOrderProvider.propTypes = {
	children: PropTypes.node,
};
