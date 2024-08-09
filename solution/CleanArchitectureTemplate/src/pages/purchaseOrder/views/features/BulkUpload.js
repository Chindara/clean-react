import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// THIRD-PARTY
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useBulkUpload } from '../../contexts/BulkUploadContext';
import BulkUploadService from 'services/BulkUploadService';
import { OPERATION_MODE } from 'constants/Types';
import { BULK_UPLOAD_ALERT } from 'constants/AlertMessage';
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';
import { isEmpty, isNull } from 'validations/validation';
import { shallowEqual } from 'react-redux';
import BulkUploadForm from '../forms/BulkUploadForm';
import useAuth from 'hooks/useAuth';

export default function BulkUpload({ selectedBulkUpload: { mode = null, id = null }, setSelectedBulkUpload }) {
	const navigate = useNavigate();
	const { userId, companyId } = useAuth();

	const queryClient = useQueryClient();
	const [availability, setAvailability] = useState(false);
	//const [selectedFile, setSelectedFile] = useState(null);
	const { bulkUpload, setBulkUpload, prevBulkUpload, setPrevBulkUpload, setError, setMode, loader, setLoader, resetBulkUploadForm } = useBulkUpload();

	const {
		data: { currentBulkUpload },
		isFetching,
	} = useQuery({
		queryKey: ['bulkUpload', id],
		queryFn: () => getBulkUploadById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentBulkUpload: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(BULK_UPLOAD_ALERT.Error.GetRecord),
	});

	const getBulkUploadById = async () => {
		const { data: { record = {} } = {} } = await BulkUploadService.getById(companyId, id);

		console.log(record);
		return { currentBulkUpload: record };
	};

	// const validateBulkUploadForm = (bulkUpload, setError) => {
	// 	const errorList = [];
	// 	const properties = [
	// 		'file',
	// 		'entity',
	// 		'natureOfPurchase',
	// 		'buyer',
	// 		'user',
	// 		'paymentMethod',
	// 	];

	// 	for (const property of properties) if (isEmpty(bulkUpload[property])) errorList.push(`validate-${property}`);


	// 	if (errorList.length) {
	// 		setError(errorList);
	// 		return false;
	// 	}

	// 	return true;
	// };

	useEffect(() => {
		initStateSetter();
	}, [mode, currentBulkUpload]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setBulkUpload({ ...bulkUpload, ...currentBulkUpload });
		setPrevBulkUpload({ ...bulkUpload, ...currentBulkUpload });
	};

	// const createBulkUpload = async () => {
	// 	setLoader(true);

	// 	try {
	// 		const bulkObject = { companyId: companyId, userId: userId, ...bulkUpload };
	// 		console.log(bulkObject);

	// 		const { isSuccess } = await BulkUploadService.create(bulkObject);

	// 		if (isSuccess) {
	// 			setAlertSuccess(BULK_UPLOAD_ALERT.Success.BulkUploadCreated);
	// 			resetBulkUploadForm();
	// 			navigate(`..`);
	// 		}
	// 	} catch (error) {
	// 		//setAlertError(BULK_UPLOAD_ALERT.Error.BulkUploadCreated);
	// 	} finally {
	// 		setTimeout(() => setLoader(false), 2200);
	// 	}
	// };

	// const updateBulkUpload = async () => {
	// 	setLoader(true);
	// 	try {
	// 		const { etaHasValue, ...updatedBulkUpload } = bulkUpload;
	// 		const currencyObject = { companyId: companyId, userId: userId, ...updatedBulkUpload };
	// 		console.log(currencyObject);

	// 		const { isSuccess } = await BulkUploadService.update(currencyObject);

	// 		if (isSuccess) {
	// 			setAlertSuccess(BULK_UPLOAD_ALERT.Success.BulkUploadUpdated);
	// 			setSelectedBulkUpload({ mode: null, id: null });
	// 			resetBulkUploadForm();
	// 			navigate(`..`);
	// 		}
	// 	} catch (error) {
	// 		setAlertError(BULK_UPLOAD_ALERT.Error.RecordUpdated);
	// 	} finally {
	// 		setTimeout(() => setLoader(false), 2200);
	// 	}
	// };

	// const handleSubmit = async () => {
	// 	const isBulkUploadValid = validateBulkUploadForm(bulkUpload, setError);

	// 	if (mode === OPERATION_MODE.Create) {
	// 		if (!isBulkUploadValid) return;

	// 		if (isBulkUploadValid) await createBulkUpload();
	// 	}

	// 	if (mode === OPERATION_MODE.Edit) {
	// 		try {
	// 			if (shallowEqual(bulkUpload, prevBulkUpload)) return setAlertWarning(BULK_UPLOAD_ALERT.Warning.NoChange);
	// 		} catch (error) {
	// 			console.log(error);
	// 		}

	// 		if (!isBulkUploadValid) return setAlertWarning(BULK_UPLOAD_ALERT.Warning.BulkUploadUpdated);

	// 		if (isBulkUploadValid) await updateBulkUpload();
	// 	}
	// };


	return (
		<>
			<BulkUploadForm  availability={availability} setAvailability={setAvailability} />
		</>
	);
}

BulkUpload.propTypes = {
	selectedBulkUpload: PropTypes.object,
	setSelectedBulkUpload: PropTypes.func,
};
