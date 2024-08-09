import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const ShipmentCostCategoryContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { SHIPMENT_COST_CATEGORY_STATE } from 'common/state/shipmentCostCategory-state';

// ==============================|| COMPANY CONTEXT & PROVIDER ||============================== //

export function ShipmentCostCategoryProvider({ children }) {
	const [shipmentCostCategory, setShipmentCostCategory] = useState(SHIPMENT_COST_CATEGORY_STATE);
	const [prevShipmentCostCategory, setPrevShipmentCostCategory] = useState(SHIPMENT_COST_CATEGORY_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetShipmentCostCategoryForm = () => {
		setShipmentCostCategory(SHIPMENT_COST_CATEGORY_STATE);
		setPrevShipmentCostCategory(SHIPMENT_COST_CATEGORY_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<ShipmentCostCategoryContext.Provider
			value={{
				shipmentCostCategory,
				setShipmentCostCategory,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevShipmentCostCategory,
				setPrevShipmentCostCategory,
				resetShipmentCostCategoryForm,
			}}
		>
			{children}
		</ShipmentCostCategoryContext.Provider>
	);
}

export const useShipmentCostCategory = () => useContext(ShipmentCostCategoryContext);

ShipmentCostCategoryProvider.propTypes = {
	children: PropTypes.node,
};
