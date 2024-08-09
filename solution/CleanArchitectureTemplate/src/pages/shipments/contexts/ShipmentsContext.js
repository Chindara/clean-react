import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { SHIPMENT_STATE } from 'common/state/shipment-state';
import { OPERATION_MODE } from 'constants/Types';
import { SHIPMENT_LOGISTICS_INVOICE_STATE } from 'common/state/shipmentLogisticsInvoice-state';
import { GUARANTEE_STATE } from 'common/state/Guarantee-state';
import { SHIPMENT_DUTY_STATE } from 'common/state/shipmentDuty-state';

const ShipmentContext = createContext({});

export function ShipmentProvider({ children }) {
	const [shipment, setShipment] = useState(SHIPMENT_STATE);
	const [prevShipment, setPrevShipment] = useState(SHIPMENT_STATE);

	const [logisticsInvoice, setLogisticsInvoice] = useState(SHIPMENT_LOGISTICS_INVOICE_STATE);
	const [prevLogisticsInvoice, setPrevLogisticsInvoice] = useState(SHIPMENT_LOGISTICS_INVOICE_STATE);

	const [guarantee, setGuarantee] = useState(GUARANTEE_STATE);
	const [prevGuarantee, setPrevGuarantee] = useState(GUARANTEE_STATE);

	const [duty, setDuty] = useState(SHIPMENT_DUTY_STATE);
	const [prevDuty, setPrevDuty] = useState(SHIPMENT_DUTY_STATE);

	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);
	const [loader, setLoader] = useState(false);

	const resetShipmentForm = () => {
		setShipment(SHIPMENT_STATE);
		setPrevShipment(SHIPMENT_STATE);
		setError([]);
		setMode(OPERATION_MODE.Create);
		setLoader(false);
	};

	const resetGuaranteeForm = () => {
		setGuarantee(GUARANTEE_STATE);
		setPrevGuarantee(GUARANTEE_STATE);
		setError([]);
		setMode(OPERATION_MODE.Create);
		setLoader(false);
	};

	const resetLogisticsInvoiceForm = () => {
		setLogisticsInvoice(SHIPMENT_LOGISTICS_INVOICE_STATE);
		setPrevLogisticsInvoice(SHIPMENT_LOGISTICS_INVOICE_STATE);
		setError([]);
		setMode(OPERATION_MODE.Create);
		setLoader(false);
	};

	const resetDutyForm = () => {
		setDuty(SHIPMENT_DUTY_STATE);
		setPrevDuty(SHIPMENT_DUTY_STATE);
		setError([]);
		setMode(OPERATION_MODE.Create);
		setLoader(false);
	};

	return (
		<ShipmentContext.Provider
			value={{
				shipment,
				setShipment,
				logisticsInvoice,
				setLogisticsInvoice,
				guarantee,
				setGuarantee,
				duty,
				setDuty,
				prevShipment,
				setPrevShipment,
				prevLogisticsInvoice,
				setPrevLogisticsInvoice,
				prevGuarantee,
				setPrevGuarantee,
				prevDuty,
				setPrevDuty,
				error,
				setError,
				mode,
				setMode,
				loader,
				setLoader,
				resetShipmentForm,
				resetLogisticsInvoiceForm,
				resetGuaranteeForm,
				resetDutyForm,
			}}
		>
			{children}
		</ShipmentContext.Provider>
	);
}

export const useShipment = () => useContext(ShipmentContext);

ShipmentProvider.propTypes = {
	children: PropTypes.node,
};
