import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { BULK_UPLOAD_STATE } from 'common/state/bulkUpload-state';
import { OPERATION_MODE } from 'constants/Types';

const BulkUploadContext = createContext({});

export function BulkUploadProvider({ children }) {
	const [bulkUpload, setBulkUpload] = useState(BULK_UPLOAD_STATE);
	const [prevBulkUpload, setPrevBulkUpload] = useState(BULK_UPLOAD_STATE);
	const [error, setError] = useState([]);
	const [mode, setMode] = useState(OPERATION_MODE.Create);
	const [loader, setLoader] = useState(false);

	const resetBulkUploadForm = () => {
		setBulkUpload(BULK_UPLOAD_STATE);
		setPrevBulkUpload(BULK_UPLOAD_STATE);
		setError([]);
		setMode(OPERATION_MODE.Create);
		setLoader(false);
	};

	return (
		<BulkUploadContext.Provider
			value={{
				bulkUpload,
				setBulkUpload,
				prevBulkUpload,
				setPrevBulkUpload,
				error,
				setError,
				mode,
				setMode,
				loader,
				setLoader,
				resetBulkUploadForm,
			}}
		>
			{children}
		</BulkUploadContext.Provider>
	);
}

export const useBulkUpload = () => useContext(BulkUploadContext);

BulkUploadProvider.propTypes = {
	children: PropTypes.node,
};
