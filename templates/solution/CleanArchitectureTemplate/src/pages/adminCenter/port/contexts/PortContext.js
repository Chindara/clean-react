import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const PortContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { PORT_STATE } from 'common/state/port-state';

// ==============================|| COMPANY CONTEXT & PROVIDER ||============================== //

export function PortProvider({ children }) {
	const [port, setPort] = useState(PORT_STATE);
	const [prevPort, setPrevPort] = useState(PORT_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetPortForm = () => {
		setPort(PORT_STATE);
		setPrevPort(PORT_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<PortContext.Provider
			value={{
				port,
				setPort,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevPort,
				setPrevPort,
				resetPortForm,
			}}
		>
			{children}
		</PortContext.Provider>
	);
}

export const usePort = () => useContext(PortContext);

PortProvider.propTypes = {
	children: PropTypes.node,
};
