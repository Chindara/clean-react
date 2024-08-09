import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const EntityContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { ENTITY_STATE } from 'common/state/entity-state';

// ==============================|| Entity CONTEXT & PROVIDER ||============================== //

export function EntityProvider({ children }) {
	const [entity, setEntity] = useState(ENTITY_STATE);
	const [prevEntity, setPrevEntity] = useState(ENTITY_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetEntityForm = () => {
		setEntity(ENTITY_STATE);
		setPrevEntity(ENTITY_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<EntityContext.Provider
			value={{
				entity,
				setEntity,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevEntity,
				setPrevEntity,
				resetEntityForm,
			}}
		>
			{children}
		</EntityContext.Provider>
	);
}

export const useEntity = () => useContext(EntityContext);

EntityProvider.propTypes = {
	children: PropTypes.node,
};
