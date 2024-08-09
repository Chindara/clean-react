import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const ShipmentLogisticsInvoiceContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { SHIPMENT_LOGISTICS_INVOICE_STATE } from 'common/state/shipmentLogisticsInvoice-state';

// ==============================|| COMPANY CONTEXT & PROVIDER ||============================== //

export function ShipmentLogisticsInvoiceProvider({ children }) {
	const [logisticsInvoice, setLogisticsInvoice] = useState(SHIPMENT_LOGISTICS_INVOICE_STATE);
	const [prevLogisticsInvoice, setPrevLogisticsInvoice] = useState(SHIPMENT_LOGISTICS_INVOICE_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetLogisticsInvoiceForm = () => {
		setLogisticsInvoice(SHIPMENT_LOGISTICS_INVOICE_STATE);
		setPrevLogisticsInvoice(SHIPMENT_LOGISTICS_INVOICE_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<ShipmentLogisticsInvoiceContext.Provider
			value={{
				logisticsInvoice,
				setLogisticsInvoice,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevLogisticsInvoice,
				setPrevLogisticsInvoice,
				resetLogisticsInvoiceForm,
			}}
		>
			{children}
		</ShipmentLogisticsInvoiceContext.Provider>
	);
}

export const useShipmentLogisticsInvoice = () => useContext(ShipmentLogisticsInvoiceContext);

ShipmentLogisticsInvoiceProvider.propTypes = {
	children: PropTypes.node,
};
