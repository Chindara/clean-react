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
import DutyForm from '../forms/ShipmentDutyForm';

// CONTEXTS
import { useShipment } from '../../contexts/ShipmentsContext';

// SERVICES
import ShipmentDutyService from 'services/ShipmentDutyService';

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { SHIPMENT_DUTY_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| Duty ||============================== //

export default function Duty({ openPanel, setOpenPanel, selectedDuty: { mode = null, id = null }, setSelectedDuty, openDeleteModal, setOpenDeleteModal, shipment }) {
	const navigate = useNavigate();
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();

	const { duty, setDuty, error, setError, loader, setLoader, setMode, prevDuty, setPrevDuty, resetDutyForm } = useShipment();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentDuty },
		isFetching,
	} = useQuery({
		queryKey: ['duty', id],
		queryFn: () => getDutyById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentDuty: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(SHIPMENT_DUTY_ALERT.Error.GetShipmentDuty),
	});

	const getDutyById = async () => {
		const { data: { record = {} } = {} } = await ShipmentDutyService.getById(companyId, id);
		return { currentDuty: record };
	};

	const validateDutyForm = (duty, setError) => {
		const errorList = [];
		const properties = [
			'hsCode',
			'submittedDateToFinance',
			'paymentDate',
			'paymentReference',
			'remarks',
			'cid',
			'vat',
			'pal',
			'xid',
			'eic',
			'ssl',
			'scl',
			'penalty',
			'surDuty',
			'additionalDuty',
		];

		console.log(errorList);
		for (const property of properties) if (isEmpty(duty[property])) errorList.push(`validate-${property}`);

		const numberRegex = /^\d+(\.\d+)?/;
		if (!numberRegex.test(duty.hsCode)) {
			errorList.push(`'validate-hsCode-format'`);
		}
		if (!numberRegex.test(duty.cid)) {
			errorList.push(`validate-cid-format`);
		}
		if (!numberRegex.test(duty.vat)) {
			errorList.push(`validate-vat-format`);
		}
		if (!numberRegex.test(duty.pal)) {
			errorList.push(`validate-pal-format`);
		}
		if (!numberRegex.test(duty.xid)) {
			errorList.push(`validate-xid-format`);
		}
		if (!numberRegex.test(duty.eic)) {
			errorList.push(`validate-eic-format`);
		}
		if (!numberRegex.test(duty.ssl)) {
			errorList.push(`validate-ssl-format`);
		}
		if (!numberRegex.test(duty.scl)) {
			errorList.push(`validate-scl-format`);
		}
		if (!numberRegex.test(duty.penalty)) {
			errorList.push(`validate-penalty-format`);
		}
		// if (!numberRegex.test(duty.surDuty)) {
		// 	errorList.push(`validate-surDuty-format`);
		// }
		// if (!numberRegex.test(duty.additionalDuty)) {
		// 	errorList.push(`validate-additionalDuty-format`);
		// }

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentDuty]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setDuty({ ...duty, ...currentDuty });
		setPrevDuty({ ...duty, ...currentDuty });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedDuty({ mode: null, id: null });
		resetDutyForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedDuty({ mode: null, id: null });
			resetDutyForm();
		}
	};

	const createDuty = async () => {
		setLoader(true);

		try {
			const dutyObject = { ...duty, companyId: companyId, userId: userId, shipmentId: shipment?.id };

			const { isSuccess } = await ShipmentDutyService.create(dutyObject);

			if (isSuccess) {
				setAlertSuccess(SHIPMENT_DUTY_ALERT.Success.ShipmentDutyCreated);
				queryClient.invalidateQueries({ queryKey: ['duty'] });
				//queryClient.invalidateQueries({ queryKey: ['shipmentDuty'] });
				setOpenPanel(false);
				resetDutyForm();
			}
		} catch (error) {
			setAlertError(SHIPMENT_DUTY_ALERT.Error.ShipmentPaymentCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateDuty = async () => {
		setLoader(true);
		try {
			const dutyObject = {
				id: id,
				companyId: companyId,
				userId: userId,
				shipmentId: shipment?.id,
				hsCode: duty?.hsCode,
				submittedDateToFinance: duty?.submittedDateToFinance,
				paymentDate: duty?.paymentDate,
				paymentReference: duty?.paymentReference,
				remarks: duty?.remarks,
				cid: duty?.cid,
				vat: duty?.vat,
				pal: duty?.pal,
				xid: duty?.xid,
				eic: duty?.eic,
				ssl: duty?.ssl,
				penalty: duty?.penalty,
				surDuty: duty?.surDuty,
				additionalDuties: duty?.additionalDuties,
			};

			const { isSuccess } = await ShipmentDutyService.update(dutyObject);
			console.log(dutyObject);
			if (isSuccess) {
				setAlertSuccess(SHIPMENT_DUTY_ALERT.Success.ShipmentDutyUpdated);
				queryClient.invalidateQueries({ queryKey: ['duty'] });
				// //queryClient.invalidateQueries({ queryKey: ['shipmentDuty'] });
				setSelectedDuty({ mode: null, id: null });
				setOpenPanel(false);
				resetDutyForm();
			}
		} catch (error) {
			setAlertError(SHIPMENT_DUTY_ALERT.Error.ShipmentDutyUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeleteDuty = async () => {
		setDeleteLoader(true);

		try {
			const dutyObject = { id, userId };
			console.log(dutyObject);

			const { isSuccess } = await ShipmentDutyService.remove(dutyObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['duty'] });
				queryClient.invalidateQueries({ queryKey: ['shipmentDuty'] });
				setAlertSuccess(SHIPMENT_DUTY_ALERT.Success.ShipmentDutyDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(SHIPMENT_DUTY_ALERT.Error.ShipmentDutyDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		//working console.log('Submit button clicked');
		const isDutyValid = validateDutyForm(duty, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isDutyValid) return;

			if (isDutyValid) await createDuty();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(Duty, prevDuty)) return setAlertWarning(SHIPMENT_DUTY_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isDutyValid) return setAlertWarning(SHIPMENT_DUTY_ALERT.Warning.CurrencyUpdated);

			if (isDutyValid) await updateDuty();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: true }}
				panelHeader={{
					title: mode === OPERATION_MODE.Create ? 'Create Shipment Duty' : mode === OPERATION_MODE.Edit ? 'Edit Shipment Duty' : 'View Shipment Duty',
					titleCloseButton: false,
				}}
				panelContent={{
					content: <DutyForm isFetching={isFetching} />,
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

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={handleDeleteDuty} loading={deleteLoader} />
		</>
	);
}

Duty.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedDuty: PropTypes.object,
	setSelectedDuty: PropTypes.func,
	shipment: PropTypes.object,
};
