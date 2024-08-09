import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { NON_PO_SHIPMENT_STATE } from 'common/state/nonPoShipment-state';
import { OPERATION_MODE } from 'constants/Types';
import { SHIPMENT_LOGISTICS_INVOICE_STATE } from 'common/state/shipmentLogisticsInvoice-state';
import { GUARANTEE_STATE } from 'common/state/Guarantee-state';
import { SHIPMENT_DUTY_STATE } from 'common/state/shipmentDuty-state';

const NonPoShipmentContext = createContext({});

export function NonPoShipmentProvider({ children }) {
	const [NonPoshipment, setNonPoShipment] = useState(NON_PO_SHIPMENT_STATE);
	const [prevNonPoShipment, setPrevNonPoShipment] = useState(NON_PO_SHIPMENT_STATE);

	const [logisticsInvoice, setLogisticsInvoice] = useState(SHIPMENT_LOGISTICS_INVOICE_STATE);
	const [prevLogisticsInvoice, setPrevLogisticsInvoice] = useState(SHIPMENT_LOGISTICS_INVOICE_STATE);

	const [guarantee, setGuarantee] = useState(GUARANTEE_STATE);
	const [prevGuarantee, setPrevGuarantee] = useState(GUARANTEE_STATE);

	const [duty, setDuty] = useState(SHIPMENT_DUTY_STATE);
	const [prevDuty, setPrevDuty] = useState(SHIPMENT_DUTY_STATE);

	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);
	const [loader, setLoader] = useState(false);

	const resetNonPoShipmentForm = () => {
		setNonPoShipment(NON_PO_SHIPMENT_STATE);
		setPrevNonPoShipment(NON_PO_SHIPMENT_STATE);
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
		<NonPoShipmentContext.Provider
			value={{
				NonPoshipment,
				setNonPoShipment,
				logisticsInvoice,
				setLogisticsInvoice,
				guarantee,
				setGuarantee,
				duty,
				setDuty,
				prevNonPoShipment,
				setPrevNonPoShipment,
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
				resetNonPoShipmentForm,
				resetLogisticsInvoiceForm,
				resetGuaranteeForm,
				resetDutyForm,
			}}
		>
			{children}
		</NonPoShipmentContext.Provider>
	);
}

export const useNonPoShipment = () => useContext(NonPoShipmentContext);

NonPoShipmentProvider.propTypes = {
	children: PropTypes.node,
};
