import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// THIRD-PARTY
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePurchaseOrder } from '../../contexts/PurchaseOrderContext';
import PurchaseOrderService from 'services/PurchaseOrderService';
import { OPERATION_MODE } from 'constants/Types';
import { PURCHASE_ORDER_ALERT } from 'constants/AlertMessage';
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';
import { isEmpty, isNull } from 'validations/validation';
import { shallowEqual } from 'react-redux';
import PurchaseOrderForm from '../forms/PurchaseOrderForm';
import useAuth from 'hooks/useAuth';

export default function PurchaseOrder({ selectedPurchaseOrder: { mode = null, id = null }, setSelectedPurchaseOrder }) {
	const navigate = useNavigate();
	const { userId, companyId } = useAuth();

	const queryClient = useQueryClient();
	const [availability, setAvailability] = useState(false);
	const { purchaseOrder, setPurchaseOrder, prevPurchaseOrder, setPrevPurchaseOrder, setError, setMode, loader, setLoader, resetPurchaseOrderForm } = usePurchaseOrder();

	const {
		data: { currentPurchaseOrder },
		isFetching,
	} = useQuery({
		queryKey: ['purchaseOrder', id],
		queryFn: () => getPurchaseOrderById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentPurchaseOrder: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(PURCHASE_ORDER_ALERT.Error.GetRecord),
	});

	const getPurchaseOrderById = async () => {
		const { data: { record = {} } = {} } = await PurchaseOrderService.getById(companyId, id);

		record.etaHasValue = record?.eta ? true : false;
		record.edaHasValue = record?.eda ? true : false;
		record.revisedETAHasValue = record?.revisedETA ? true : false;

		console.log(record);
		return { currentPurchaseOrder: record };
	};

	const validateForm = (purchaseOrder, setError) => {
		console.log('validateForm', purchaseOrder);

		const errorList = [];
		const properties = [
			'poNo',
			'poDate',
			'dateOfDelivery',
			'description',
			'piNo',
			'entity',
			'natureOfPurchase',
			'vendor',
			'country',
			'currency',
			'amount',
			'buyer',
			'user',
			'paymentMethod',
			'transportMode',
			'incoTerm',
			// 'quantity',
			// 'volume',
		];

		for (const property of properties) if (isEmpty(purchaseOrder[property])) errorList.push(`validate-${property}`);

		if (!errorList.includes('validate-amount')) {
			const regex = /^\d*\.?\d*$/;

			if (!regex.test(purchaseOrder.amount)) {
				errorList.push(`validate-amount-format`);
			}

			if (Number(purchaseOrder.amount) <= 0) {
				errorList.push(`validate-amount-format`);
			}
		}

		// if (!errorList.includes('validate-quantity')) {
		// 	const regex = /^\d*\.?\d*$/;

		// 	if (!regex.test(purchaseOrder.quantity)) {
		// 		errorList.push(`validate-quantity-format`);
		// 	}

		// 	if (Number(purchaseOrder.quantity) <= 0) {
		// 		errorList.push(`validate-quantity-format`);
		// 	}
		// }

		// if (!errorList.includes('validate-volume')) {
		// 	const regex = /^\d*\.?\d*$/;

		// 	if (!regex.test(purchaseOrder.volume)) {
		// 		errorList.push(`validate-volume-format`);
		// 	}

		// 	if (Number(purchaseOrder.volume) <= 0) {
		// 		errorList.push(`validate-volume-format`);
		// 	}
		// }

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentPurchaseOrder]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setPurchaseOrder({ ...purchaseOrder, ...currentPurchaseOrder });
		setPrevPurchaseOrder({ ...purchaseOrder, ...currentPurchaseOrder });
	};

	const createRecord = async () => {
		setLoader(true);

		try {
			const { claimableAmount, claimedAmount, quantity, volume, ...otherInfo } = purchaseOrder;

			const a = claimableAmount === '' ? null : claimableAmount;
			const b = claimedAmount === '' ? null : claimedAmount;
			const c = quantity === '' ? null : quantity;
			const d = volume === '' ? null : volume;

			const currencyObject = { companyId: companyId, userId: userId, claimableAmount: a, claimedAmount: b, quantity: c, volume: d, ...otherInfo };
			console.log(currencyObject);

			const { isSuccess } = await PurchaseOrderService.create(currencyObject);

			if (isSuccess) {
				setAlertSuccess(PURCHASE_ORDER_ALERT.Success.PurchaseOrderCreated);
				resetPurchaseOrderForm();
				navigate(`..`);
			}
		} catch (error) {
			setAlertError(PURCHASE_ORDER_ALERT.Error.RecordCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateRecord = async () => {
		setLoader(true);
		try {
			const { etaHasValue, ...updatedPurchaseOrder } = purchaseOrder;
			const currencyObject = { companyId: companyId, userId: userId, ...updatedPurchaseOrder };
			console.log(currencyObject);

			const { isSuccess } = await PurchaseOrderService.update(currencyObject);

			if (isSuccess) {
				setAlertSuccess(PURCHASE_ORDER_ALERT.Success.PurchaseOrderUpdated);
				setSelectedPurchaseOrder({ mode: null, id: null });
				resetPurchaseOrderForm();
				navigate(`..`);
			}
		} catch (error) {
			setAlertError(PURCHASE_ORDER_ALERT.Error.RecordUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleSubmit = async () => {
		const isFormValid = validateForm(purchaseOrder, setError);

		console.log(isFormValid);
		const isPurchaseNoAvailable = availability ? false : true;

		if (mode === OPERATION_MODE.Create) {
			if (!isFormValid) return;
			if (!isPurchaseNoAvailable) return;

			if (isFormValid) await createRecord();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(purchaseOrder, prevPurchaseOrder)) return setAlertWarning(PURCHASE_ORDER_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isFormValid) return setAlertWarning(PURCHASE_ORDER_ALERT.Warning.PurchaseOrderUpdated);
			console.log('update');
			if (isFormValid) await updateRecord();
		}
	};

	return (
		<>
			<PurchaseOrderForm handleSubmit={handleSubmit} availability={availability} setAvailability={setAvailability} />
		</>
	);
}

PurchaseOrder.propTypes = {
	selectedPurchaseOrder: PropTypes.object,
	setSelectedPurchaseOrder: PropTypes.func,
};
