import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// THIRD-PARTY
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isEqual } from 'lodash';

// PROJECT IMPORT
import MainCard from 'components/MainCard';
import BankFormDA from '../forms/BankFormDA';
import BankFormDP from '../forms/BankFormDP';
import BankFormLC from '../forms/BankFormLC';
import BankFormOA from '../forms/BankFormOA';
import BankFormTT from '../forms/BankFormTT';
import PurchaseOrderBankButtonAction from 'pages/purchaseOrder/components/PurchaseOrderBankButtonAction';

// CONTEXTS
import { usePurchaseOrderBank } from 'pages/purchaseOrder/contexts/BankContext';

// HOOKS
import useAuth from 'hooks/useAuth';

// SERVICES
import PurchaseOrderBankService from 'services/PurchaseOrderBankService';

// VALIDATIONS
import { validateBankForm } from 'pages/purchaseOrder/validations/purchase-order-bank-validations';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { PAYMENT_METHOD } from 'constants/Common';
import { PURCHASE_ORDER_BANK_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import PurchaseOrderService from 'services/PurchaseOrderService';

export default function Bank() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { purchaseOrderId = null } = useParams();
	const { state: { paymentMethod: paymentMethodOriginal = null, poNo = null } = {} } = useLocation();
	const { companyId, userId } = useAuth();
	const [paymentMethod, setPaymentMethod] = useState('');

	const { purchaseOrderBank, setPurchaseOrderBank, prevPurchaseOrderBank, setPrevPurchaseOrderBank, mode, setMode, setError, resetPurchaseOrderBankForm, loader, setLoader } =
		usePurchaseOrderBank();

	const {
		data: { bankInfo },
		isFetching,
	} = useQuery({
		queryKey: ['bankInfo', purchaseOrderId],
		queryFn: () => getPurchaseOrderBankById(),
		keepPreviousData: false,
		refetchOnWindowFocus: false,
		initialData: { bankInfo: {} },
		enabled: purchaseOrderId ? true : false,
		onError: () => setAlertError(PURCHASE_ORDER_BANK_ALERT.Error.GetPurchaseOrderBank),
	});

	const getPurchaseOrderBankById = async () => {
		const { data } = await PurchaseOrderBankService.getById(companyId, purchaseOrderId);
		return { bankInfo: data?.record };
	};

	useEffect(() => {
		initStateSetter();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bankInfo, companyId, purchaseOrderId]);

	const initStateSetter = async () => {
		console.log('paymentMethod', paymentMethodOriginal);
		const prefix = paymentMethodOriginal.split(' ')[0];
		setPaymentMethod(prefix);
		console.log('prefix', prefix);
		const isPaymentMethodValid = Object.values(PAYMENT_METHOD)?.includes(prefix);
		const isEditable = bankInfo && Object.values(bankInfo)?.length ? true : false;

		const purchaseOrder = await PurchaseOrderService.getById(companyId, purchaseOrderId);

		if (!prefix) return setAlertError(PURCHASE_ORDER_BANK_ALERT.Error.PaymentMethodNotFound);
		if (!isPaymentMethodValid) return setAlertError(PURCHASE_ORDER_BANK_ALERT.Error.PaymentMethodInvalid);
		if (isEditable) setMode(OPERATION_MODE.Edit);

		setPurchaseOrderBank((prevState) => ({
			...prevState,
			poNo: poNo,
			paymentMethod: prefix,
			purchaseAmount: purchaseOrder?.data?.record.amount,
			...(isEditable && {
				[prefix]: {
					...prevState[prefix],
					...Object.fromEntries(Object.entries(bankInfo).filter(([key]) => Object.hasOwn(prevState[prefix], key))),
					bank: { value: bankInfo?.bank },
				},
			}),
		}));

		setPrevPurchaseOrderBank((prevState) => ({
			...prevState,
			poNo: poNo,
			paymentMethod: prefix,
			purchaseAmount: purchaseOrder?.data?.Amount,
			...(isEditable && {
				[prefix]: {
					...prevState[prefix],
					...Object.fromEntries(Object.entries(bankInfo).filter(([key]) => Object.hasOwn(prevState[prefix], key))),
					bank: { value: bankInfo?.bank },
				},
			}),
		}));
	};

	const handleCreate = async () => {
		const { bank: selectedBank, ...otherInfo } = purchaseOrderBank[paymentMethod];

		const dataObject = {
			companyId: companyId,
			purchaseId: purchaseOrderId,
			bankId: selectedBank?.value,
			//...otherInfo,
			...Object.entries(otherInfo).reduce((accumulator, [key, value]) => ({ ...accumulator, [key]: value === '' ? null : value }), {}),
			userId: userId,
		};

		const { isSuccess } = await PurchaseOrderBankService.createPurchaseOrderBank(paymentMethod, dataObject);

		if (isSuccess) {
			setAlertSuccess(PURCHASE_ORDER_BANK_ALERT.Success.PurchaseOrderBankCreated);
			queryClient.invalidateQueries({ queryKey: ['bankInfo'] });
			resetPurchaseOrderBankForm();
			navigate(`..`);
		}

		if (!isSuccess) setAlertError(PURCHASE_ORDER_BANK_ALERT.Error.PurchaseOrderBankCreated);
	};

	const handleUpdate = async () => {
		const { bank: selectedBank, ...otherInfo } = purchaseOrderBank[paymentMethod];

		const dataObject = {
			id: bankInfo.id,
			companyId: companyId,
			purchaseId: purchaseOrderId,
			bankId: selectedBank?.value,
			///...otherInfo,
			...Object.entries(otherInfo).reduce((accumulator, [key, value]) => ({ ...accumulator, [key]: value === '' ? null : value }), {}),
			userId: userId,
		};

		const { isSuccess } = await PurchaseOrderBankService.updatePurchaseOrderBank(paymentMethod, dataObject);

		if (isSuccess) {
			setAlertSuccess(PURCHASE_ORDER_BANK_ALERT.Success.PurchaseOrderBankUpdated);
			queryClient.invalidateQueries({ queryKey: ['bankInfo'] });
			//resetPurchaseOrderBankForm();
			//navigate(`..`);
		}

		if (!isSuccess) setAlertError(PURCHASE_ORDER_BANK_ALERT.Error.PurchaseOrderBankUpdated);
	};

	const handleSubmit = async () => {
		if (!validateBankForm(paymentMethod, purchaseOrderBank[paymentMethod], setError)) return;

		if (isEqual(prevPurchaseOrderBank, purchaseOrderBank) && mode === OPERATION_MODE.Edit) return setAlertWarning(PURCHASE_ORDER_BANK_ALERT.Warning.NoChange);

		setLoader(true);

		if (mode === OPERATION_MODE.Create) await handleCreate();

		if (mode === OPERATION_MODE.Edit) await handleUpdate();

		setTimeout(() => setLoader(false), 2200);
	};

	return (
		<>
			{PAYMENT_METHOD.DA === paymentMethod && <BankFormDA />}
			{PAYMENT_METHOD.DP === paymentMethod && <BankFormDP />}
			{PAYMENT_METHOD.LC === paymentMethod && <BankFormLC />}
			{PAYMENT_METHOD.OA === paymentMethod && <BankFormOA />}
			{PAYMENT_METHOD.TT === paymentMethod && <BankFormTT />}

			{PAYMENT_METHOD[paymentMethod] && <PurchaseOrderBankButtonAction loader={loader} handleSubmit={handleSubmit} />}
		</>
	);
}
