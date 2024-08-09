import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const ClearingAgentContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { CLEARING_AGENT_STATE } from 'common/state/clearingAgent';

// ==============================|| COMPANY CONTEXT & PROVIDER ||============================== //

export function ClearingAgentProvider({ children }) {
	const [clearingAgent, setClearingAgent] = useState(CLEARING_AGENT_STATE);
	const [prevClearingAgent, setPrevClearingAgent] = useState(CLEARING_AGENT_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetClearingAgentForm = () => {
		setClearingAgent(CLEARING_AGENT_STATE);
		setPrevClearingAgent(CLEARING_AGENT_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<ClearingAgentContext.Provider
			value={{
				clearingAgent,
				setClearingAgent,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevClearingAgent,
				setPrevClearingAgent,
				resetClearingAgentForm,
			}}
		>
			{children}
		</ClearingAgentContext.Provider>
	);
}

export const useClearingAgent = () => useContext(ClearingAgentContext);

ClearingAgentProvider.propTypes = {
	children: PropTypes.node,
};
