import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const ShipmentDutyContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { SHIPMENT_DUTY_STATE } from 'common/state/shipmentDuty-state';

// ==============================|| COMPANY CONTEXT & PROVIDER ||============================== //

export function ShipmentDutyProvider({ children }) {
	const [duty, setDuty] = useState(SHIPMENT_DUTY_STATE);
	const [prevDuty, setPrevDuty] = useState(SHIPMENT_DUTY_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetDutyForm = () => {
		setDuty(SHIPMENT_DUTY_STATE);
		setPrevDuty(SHIPMENT_DUTY_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<ShipmentDutyContext.Provider
			value={{
				duty,
				setDuty,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevDuty,
				setPrevDuty,
				resetDutyForm,
			}}
		>
			{children}
		</ShipmentDutyContext.Provider>
	);
}

export const useShipmentDuty = () => useContext(ShipmentDutyContext);

ShipmentDutyProvider.propTypes = {
	children: PropTypes.node,
};
