import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// THIRD-PARTY
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { shallowEqual } from 'react-redux';

// PROJECT IMPORT
import Panel from 'components/ui/Panel';
import DeleteModel from 'components/ui/DeleteModel';
import PanelFooter from 'components/ui/PanelFooter';
import ExitModel from 'components/ui/ExitModel';
import PaymentForm from '../forms/PaymentForm';

// CONTEXTS
import { usePayment } from 'pages/adminCenter/payment/contexts/PaymentContext';

// SERVICES
import PaymentService from 'services/PaymentService';

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { PAYMENT_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';
// ==============================|| PAYMENT ||============================== //

export default function Payment({
	openPanel,
	setOpenPanel,
	openDeleteModal,
	setOpenDeleteModal,
	selectedPayment: { mode = null, id = null },
	setSelectedPayment,
}) {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const {
		payment,
		setPayment,
		setError,
		loader,
		setLoader,
		setMode,
		prevPayment,
		setPrevPayment,
		resetPaymentForm,
	} = usePayment();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentPayment },
		isFetching,
	} = useQuery({
		queryKey: ['payment', id],
		queryFn: () => getPaymentById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentPayment: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(PAYMENT_ALERT.Error.GetPayment),
	});

	const getPaymentById = async () => {
		const { data: { record = {} } = {} } = await PaymentService.getById(companyId, id);
		return { currentPayment: record };
	};

	const validatePaymentForm = (payment, setError) => {
		const errorList = [];
		const properties = ['name'];

		for (const property of properties) if (isEmpty(payment[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentPayment]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setPayment({ ...payment, ...currentPayment });
		setPrevPayment({ ...payment, ...currentPayment });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedPayment({ mode: null, id: null });
		resetPaymentForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedPayment({ mode: null, id: null });
			resetPaymentForm();
		}
	};

	const createPayment = async () => {
		setLoader(true);

		try {
			const paymentObject = { companyId: companyId, userId: userId, ...payment };
			console.log(paymentObject);

			const { isSuccess } = await PaymentService.create(paymentObject);

			if (isSuccess) {
				setAlertSuccess(PAYMENT_ALERT.Success.PaymentCreated);
				queryClient.invalidateQueries({ queryKey: ['payment'] });
				setOpenPanel(false);
				resetPaymentForm();
			}
		} catch (error) {
			setAlertError(PAYMENT_ALERT.Error.PaymentCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updatePayment = async () => {
		setLoader(true);
		try {
			const { id, name, status } = payment;

			const paymentObject = { id, name, status, userId };
			console.log(paymentObject);

			const { isSuccess } = await PaymentService.update(paymentObject);

			if (isSuccess) {
				setAlertSuccess(PAYMENT_ALERT.Success.PaymentUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['payment'] });
				setSelectedPayment({ mode: null, id: null });
				resetPaymentForm();
			}
		} catch (error) {
			setAlertError(PAYMENT_ALERT.Error.PaymentUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeletePayment = async () => {
		setDeleteLoader(true);

		try {
			const paymentObject = { id, userId };
			console.log(paymentObject);

			const { isSuccess } = await PaymentService.remove(paymentObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['payment'] });
				setAlertSuccess(PAYMENT_ALERT.Success.PaymentDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(PAYMENT_ALERT.Error.PaymentDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		const isPaymentValid = validatePaymentForm(payment, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isPaymentValid) return;

			if (isPaymentValid) await createPayment();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(payment, prevPayment)) return setAlertWarning(PAYMENT_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isPaymentValid) return setAlertWarning(PAYMENT_ALERT.Warning.PaymentUpdated);

			if (isPaymentValid) await updatePayment();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{ title: mode === OPERATION_MODE.Create? 'Create Payment'
				: mode === OPERATION_MODE.Edit? 'Edit Payment'
				: 'View Payment',
			titleCloseButton: false}}
				panelContent={{
					content: <PaymentForm isFetching={isFetching} />,
					contentDivider: true,
				}}
				panelFooter={{
					footer: true,
					footerContent: (
						<PanelFooter
							footerMode={mode}
							buttonLoader={loader}
							handleSubmit={handleSubmit}
							handlePanelClose={handlePanelClose}
							handlePanelCancel={handleExitModal}
						/>
					),
				}}
			/>
			<ExitModel openModal={openExitModal} handleModalClose={handleExitModal} />

			<DeleteModel
				openModal={openDeleteModal}
				handleModalClose={handleDeleteModalClose}
				handleDelete={handleDeletePayment}
				loading={deleteLoader}
			/>
		</>
	);
}

Payment.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedPayment: PropTypes.object,
	setSelectedPayment: PropTypes.func,
};
