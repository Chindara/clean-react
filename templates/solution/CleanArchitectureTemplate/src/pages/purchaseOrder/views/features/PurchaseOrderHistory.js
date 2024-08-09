import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { usePurchaseOrderHistory } from 'pages/purchaseOrder/contexts/HistoryContext';
import { isEmpty } from 'validations/validation';
import { setAlertError, setAlertSuccess } from 'components/alert/Alert';
import PurchaseOrderHistoryService from 'services/PurchaseOrderHistoryService';
import PurchaseOrderHistoryForm from '../forms/PurchaseOrderHistoryForm';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PURCHASE_ORDER_HISTORY_ALERT } from 'constants/AlertMessage';

export default function PurchaseOrderHistory() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { purchaseOrderId } = useParams();
	const { userId, companyId } = useAuth();
	const {
		purchaseOrderHistory,
		setPurchaseOrderHistory,
		purchaseOrderHistories,
		setPurchaseOrderHistories,
		setError,
		loader,
		setLoader,
		resetPurchaseOrderHistoryForm,
	} = usePurchaseOrderHistory();

	const {
		data: { currentPurchaseOrderHistories },
		isFetching,
	} = useQuery({
		queryKey: ['purchaseOrderHistory', purchaseOrderId],
		queryFn: () => getPurchaseOrderHistories(),
		refetchOnWindowFocus: false,
		initialData: { currentPurchaseOrderHistories: [] },
	});

	const getPurchaseOrderHistories = async () => {
		const response = await PurchaseOrderHistoryService.getAll(companyId, purchaseOrderId);
		return { currentPurchaseOrderHistories: response.data };
	};

	const validateForm = (purchaseOrderHistory, setError) => {
		const errorList = [];
		const properties = ['comment'];

		for (const property of properties)
			if (isEmpty(purchaseOrderHistory[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	// useEffect(() => {
	// 	(async () => {
	// 		const getPurchaseOrderHistorys = await PurchaseOrderHistoryService.getAll(companyId, purchaseOrderId);

	// 		const [purchaseOrderHistorys = []] = await Promise.all([getPurchaseOrderHistorys]);
	// 		console.log(purchaseOrderHistorys?.data);
	// 		setPurchaseOrderHistorys(purchaseOrderHistorys?.data);
	// 	})();
	// }, []);

	useEffect(() => {
		initStateSetter();
	}, [isFetching]);

	const initStateSetter = () => {
		setPurchaseOrderHistories(currentPurchaseOrderHistories);
	};

	const createRecord = async () => {
		setLoader(true);

		try {
			const currencyObject = {
				companyId: companyId,
				userId: userId,
				...purchaseOrderHistory,
				poId: purchaseOrderId,
			};

			const { isSuccess } = await PurchaseOrderHistoryService.create(currencyObject);

			if (isSuccess) {
				setAlertSuccess(PURCHASE_ORDER_HISTORY_ALERT.Success.PurchaseOrderHistoryCreated);
				queryClient.invalidateQueries({ queryKey: ['purchaseOrderHistory'] });
				resetPurchaseOrderHistoryForm();
				//navigate(`..`);
			}
		} catch (error) {
			setAlertError(PURCHASE_ORDER_HISTORY_ALERT.Error.PurchaseOrderHistoryCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleSubmit = async () => {
		const isFormValid = validateForm(purchaseOrderHistory, setError);

		if (!isFormValid) return;

		if (isFormValid) await createRecord();

		// if (mode === OPERATION_MODE.Edit) {
		// 	try {
		// 		if (shallowEqual(purchaseOrder, prevPurchaseOrder))
		// 			return setAlertWarning(PURCHASE_ORDER_ALERT.Warning.NoChange);
		// 	} catch (error) {
		// 		console.log(error);
		// 	}

		// 	if (!isFormValid) return setAlertWarning(PURCHASE_ORDER_ALERT.Warning.PurchaseOrderUpdated);

		// 	if (isFormValid) await updateRecord();
		// }
	};

	return (
		<>
			<PurchaseOrderHistoryForm handleSubmit={handleSubmit} />
		</>
	);
}

PurchaseOrderHistory.propTypes = {
	selectedPurchaseOrder: PropTypes.object,
	setSelectedPurchaseOrder: PropTypes.func,
};
