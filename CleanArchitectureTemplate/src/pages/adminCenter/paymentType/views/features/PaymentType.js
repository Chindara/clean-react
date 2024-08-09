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
import PaymentTypeForm from '../forms/PaymentTypeForm';

// CONTEXTS
import { usePaymentType } from 'pages/adminCenter/paymentType/contexts/PaymentTypeContext';

// SERVICES
import ShipmentPaymentTypeService from 'services/ShipmentPaymentTypeService';

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { PAYMENT_TYPE_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| PAYMENT_TYPE ||============================== //

export default function PaymentType({ openPanel, setOpenPanel, openDeleteModal, setOpenDeleteModal, selectedPaymentType: { mode = null, id = null }, setSelectedPaymentType }) {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const { paymentType, setPaymentType, setError, loader, setLoader, setMode, prevPaymentType, setPrevPaymentType, resetPaymentTypeForm } = usePaymentType();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentPaymentType },
		isFetching,
	} = useQuery({
		queryKey: ['paymentType', id],
		queryFn: () => getPaymentTypeById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentPaymentType: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(PAYMENT_TYPE_ALERT.Error.GetPaymentType),
	});

	const getPaymentTypeById = async () => {
		const { data: { record = {} } = {} } = await ShipmentPaymentTypeService.getById(companyId, id);
		console.log(record);
		return { currentPaymentType: record };
	};

	const validatePaymentTypeForm = (paymentType, setError) => {
		const errorList = [];
		const properties = ['name'];

		for (const property of properties) if (isEmpty(paymentType[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentPaymentType]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setPaymentType({ ...paymentType, ...currentPaymentType });
		setPrevPaymentType({ ...paymentType, ...currentPaymentType });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedPaymentType({ mode: null, id: null });
		resetPaymentTypeForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedPaymentType({ mode: null, id: null });
			resetPaymentTypeForm();
		}
	};

	const createPaymentType = async () => {
		setLoader(true);

		try {
			const { name } = paymentType;
			const paymentTypeObject = { companyId, userId, name: name };
			console.log(paymentTypeObject);

			const { isSuccess } = await ShipmentPaymentTypeService.create(paymentTypeObject);

			if (isSuccess) {
				setAlertSuccess(PAYMENT_TYPE_ALERT.Success.PaymentTypeCreated);
				queryClient.invalidateQueries({ queryKey: ['paymentType'] });
				setOpenPanel(false);
				resetPaymentTypeForm();
			}
		} catch (error) {
			setAlertError(PAYMENT_TYPE_ALERT.Error.PaymentTypeCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updatePaymentType = async () => {
		setLoader(true);
		try {
			const { name } = paymentType;
			const paymentTypeObject = { id, userId, name: name, ...paymentType };
			console.log(paymentTypeObject);

			const { isSuccess } = await ShipmentPaymentTypeService.update(paymentTypeObject);

			if (isSuccess) {
				setAlertSuccess(PAYMENT_TYPE_ALERT.Success.PaymentTypeUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['paymentType'] });
				setSelectedPaymentType({ mode: null, id: null });
				resetPaymentTypeForm();
			}
		} catch (error) {
			setAlertError(PAYMENT_TYPE_ALERT.Error.PaymentTypeUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeletePaymentType = async () => {
		setDeleteLoader(true);

		try {
			const paymentTypeObject = { id, userId };
			console.log(paymentTypeObject);
			const { isSuccess } = await ShipmentPaymentTypeService.remove(paymentTypeObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['paymentType'] });
				setAlertSuccess(PAYMENT_TYPE_ALERT.Success.PaymentTypeDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(PAYMENT_TYPE_ALERT.Error.PaymentTypeDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		const isPaymentTypeValid = validatePaymentTypeForm(paymentType, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isPaymentTypeValid) return;

			if (isPaymentTypeValid) await createPaymentType();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(paymentType, prevPaymentType)) return setAlertWarning(PAYMENT_TYPE_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isPaymentTypeValid) return setAlertWarning(PAYMENT_TYPE_ALERT.Warning.PaymentTypeUpdated);

			if (isPaymentTypeValid) await updatePaymentType();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{
					title: mode === OPERATION_MODE.Create ? 'Create Payment Type' : mode === OPERATION_MODE.Edit ? 'Edit Payment Type' : 'View Payment Type',
					titleCloseButton: false,
				}}
				//panelHeader={{ title: 'PaymentType', titleCloseButton: false }}
				panelContent={{
					content: <PaymentTypeForm isFetching={isFetching} />,
					contentDivider: true,
				}}
				panelFooter={{
					footer: true,
					footerContent: (
						<PanelFooter footerMode={mode} buttonLoader={loader} handleSubmit={handleSubmit} handlePanelClose={handlePanelClose} handlePanelCancel={handleExitModal} />
					),
				}}
			/>
			<ExitModel openModal={openExitModal} handleModalClose={handleExitModal} />

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={handleDeletePaymentType} loading={deleteLoader} />
		</>
	);
}

PaymentType.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedPaymentType: PropTypes.object,
	setSelectedPaymentType: PropTypes.func,
};
