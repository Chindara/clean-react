import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const ShipmentPaymentTypeContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { SHIPMENT_PAYMENT_TYPE_STATE } from 'common/state/shipmentPaymentType-state';

// ==============================|| COMPANY CONTEXT & PROVIDER ||============================== //

export function ShipmentPaymentTypeProvider({ children }) {
	const [shipmentPaymentType, setShipmentPaymentType] = useState(SHIPMENT_PAYMENT_TYPE_STATE);
	const [prevShipmentPaymentType, setPrevShipmentPaymentType] = useState(SHIPMENT_PAYMENT_TYPE_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetShipmentPaymentTypeForm = () => {
		setShipmentPaymentType(SHIPMENT_PAYMENT_TYPE_STATE);
		setPrevShipmentPaymentType(SHIPMENT_PAYMENT_TYPE_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<ShipmentPaymentTypeContext.Provider
			value={{
				shipmentPaymentType,
				setShipmentPaymentType,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevShipmentPaymentType,
				setPrevShipmentPaymentType,
				resetShipmentPaymentTypeForm,
			}}
		>
			{children}
		</ShipmentPaymentTypeContext.Provider>
	);
}

export const useShipmentPaymentType = () => useContext(ShipmentPaymentTypeContext);

ShipmentPaymentTypeProvider.propTypes = {
	children: PropTypes.node,
};
