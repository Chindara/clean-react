import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const IncotermContext = createContext({});

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { INCOTERM_STATE } from 'common/state/incoterm-state';

// ==============================|| COMPANY CONTEXT & PROVIDER ||============================== //

export function IncotermProvider({ children }) {
	const [incoterm, setIncoterm] = useState(INCOTERM_STATE);
	const [prevIncoterm, setPrevIncoterm] = useState(INCOTERM_STATE);
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);

	const resetIncotermForm = () => {
		setIncoterm(INCOTERM_STATE);
		setPrevIncoterm(INCOTERM_STATE);
		setLoader(false);
		setError([]);
		setMode(OPERATION_MODE.Create);
	};

	return (
		<IncotermContext.Provider
			value={{
				incoterm,
				setIncoterm,
				error,
				setError,
				loader,
				setLoader,
				mode,
				setMode,
				prevIncoterm,
				setPrevIncoterm,
				resetIncotermForm,
			}}
		>
			{children}
		</IncotermContext.Provider>
	);
}

export const useIncoterm = () => useContext(IncotermContext);

IncotermProvider.propTypes = {
	children: PropTypes.node,
};
