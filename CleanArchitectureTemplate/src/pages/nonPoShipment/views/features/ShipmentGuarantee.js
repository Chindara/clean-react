import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// THIRD-PARTY
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { shallowEqual } from 'react-redux';

// PROJECT IMPORT
import Panel from 'components/ui/Panel';
import DeleteModel from 'components/ui/DeleteModel';
import PanelFooter from 'components/ui/PanelFooter';
import ExitModel from 'components/ui/ExitModel';
import GuaranteeForm from '../forms/ShipmentGuaranteeForm';

// CONTEXTS
import { useNonPoShipment } from '../../contexts/NonPoShipmentContext';

// SERVICES
import GuaranteeService from 'services/ShipmentGuaranteeService';

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { GUARANTEE_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| GUARANTEE ||============================== //

export default function Guarantee({ openPanel, setOpenPanel, selectedGuarantee: { mode = null, id = null }, setSelectedGuarantee, openDeleteModal, setOpenDeleteModal, shipment }) {
	const navigate = useNavigate();
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();

	const { guarantee, setGuarantee, error, setError, loader, setLoader, setMode, prevGuarantee, setPrevGuarantee, resetGuaranteeForm } = useNonPoShipment();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentGuarantee },
		isFetching,
	} = useQuery({
		queryKey: ['guarantee', id],
		queryFn: () => getGuaranteeById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentGuarantee: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(GUARANTEE_ALERT.Error.GetGuarantee),
	});

	const getGuaranteeById = async () => {
		console.log('hello');
		const { data: { record = {} } = {} } = await GuaranteeService.getById(companyId, id);
		console.log(record);
		return { currentGuarantee: record };
	};

	const validateGuaranteeForm = (guarantee, setError) => {
		const errorList = [];
		const properties = ['bank', 'type', 'amount', 'currency', 'beneficiary', 'issueDate', 'expiryDate', 'extendedDate', 'remark'];

		console.log(errorList);
		for (const property of properties) if (isEmpty(guarantee[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentGuarantee]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setGuarantee({ ...guarantee, ...currentGuarantee });
		setPrevGuarantee({ ...guarantee, ...currentGuarantee });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedGuarantee({ mode: null, id: null });
		resetGuaranteeForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedGuarantee({ mode: null, id: null });
			resetGuaranteeForm();
		}
	};

	const createGuarantee = async () => {
		setLoader(true);

		try {
			const guaranteeObject = { ...guarantee, companyId: companyId, userId: userId, shipmentId: shipment?.id };
			console.log(guaranteeObject);

			const { isSuccess } = await GuaranteeService.create(guaranteeObject);

			if (isSuccess) {
				setAlertSuccess(GUARANTEE_ALERT.Success.GuaranteeCreated);
				queryClient.invalidateQueries({ queryKey: ['guarantee'] });
				//queryClient.invalidateQueries({ queryKey: ['Guarantee'] });
				setOpenPanel(false);
				resetGuaranteeForm();
			}
		} catch (error) {
			setAlertError(GUARANTEE_ALERT.Error.PaymentCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateGuarantee = async () => {
		setLoader(true);
		try {
			const guaranteeObject = {
				id: id,
				companyId: companyId,
				userId: userId,
				shipmentId: shipment?.id,
				bank: guarantee?.bank,
				type: guarantee?.type,
				currency: guarantee?.currency,
				amount: guarantee?.amount,
				beneficiary: guarantee?.beneficiary,
				issueDate: guarantee?.issueDate,
				expiryDate: guarantee?.expiryDate,
				extendedDate: guarantee?.extendedDate,
				remark: guarantee?.remark,
				status: guarantee?.status,
			};

			const { isSuccess } = await GuaranteeService.update(guaranteeObject);
			console.log(guaranteeObject);
			if (isSuccess) {
				setAlertSuccess(GUARANTEE_ALERT.Success.GuaranteeUpdated);
				queryClient.invalidateQueries({ queryKey: ['guarantee'] });
				// //queryClient.invalidateQueries({ queryKey: ['Guarantee'] });
				setSelectedGuarantee({ mode: null, id: null });
				setOpenPanel(false);
				resetGuaranteeForm();
			}
		} catch (error) {
			setAlertError(GUARANTEE_ALERT.Error.GuaranteeUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeleteGuarantee = async () => {
		setDeleteLoader(true);

		try {
			const guaranteeObject = { id, userId };
			console.log(guaranteeObject);

			const { isSuccess } = await GuaranteeService.remove(guaranteeObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['guarantee'] });
				//queryClient.invalidateQueries({ queryKey: ['Guarantee'] });
				setAlertSuccess(GUARANTEE_ALERT.Success.GuaranteeDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(GUARANTEE_ALERT.Error.GuaranteeDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		const isGuaranteeValid = validateGuaranteeForm(guarantee, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isGuaranteeValid) return;

			if (isGuaranteeValid) await createGuarantee();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(guarantee, prevGuarantee)) return setAlertWarning(GUARANTEE_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isGuaranteeValid) return setAlertWarning(GUARANTEE_ALERT.Warning.CurrencyUpdated);

			if (isGuaranteeValid) await updateGuarantee();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{ title: 'Guarantee', titleCloseButton: false }}
				panelContent={{
					content: <GuaranteeForm isFetching={isFetching} />,
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

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={handleDeleteGuarantee} loading={deleteLoader} />
		</>
	);
}

Guarantee.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedGuarantee: PropTypes.object,
	setSelectedGuarantee: PropTypes.func,
	guarantee: PropTypes.object,
	shipment: PropTypes.object,
};
