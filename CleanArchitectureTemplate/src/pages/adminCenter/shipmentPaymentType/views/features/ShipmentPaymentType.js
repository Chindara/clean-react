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
import ShipmentPaymentTypeForm from '../forms/ShipmentPaymentTypeForm';

// CONTEXTS
import { useShipmentPaymentType } from 'pages/adminCenter/shipmentPaymentType/contexts/ShipmentPaymentTypeContext';

// SERVICES

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { SHIPMENT_PAYMENT_TYPE_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';
import ShipmentPaymentTypeService from 'services/ShipmentPaymentTypeService';

// ==============================|| ShipmentPaymentType ||============================== //

export default function ShipmentPaymentType({
	openPanel,
	setOpenPanel,
	openDeleteModal,
	setOpenDeleteModal,
	selectedShipmentPaymentType: { mode = null, id = null },
	setSelectedShipmentPaymentType,
}) {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const { shipmentPaymentType, setShipmentPaymentType, setError, loader, setLoader, setMode, prevShipmentPaymentType, setPrevShipmentPaymentType, resetShipmentPaymentTypeForm } =
		useShipmentPaymentType();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentShipmentPaymentType },
		isFetching,
	} = useQuery({
		queryKey: ['ShipmentPaymentType', id],
		queryFn: () => getShipmentPaymentTypeById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentShipmentPaymentType: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(SHIPMENT_PAYMENT_TYPE_ALERT.Error.GetShipmentPaymentType),
	});

	const getShipmentPaymentTypeById = async () => {
		const { data: { record = {} } = {} } = await ShipmentPaymentTypeService.getById(companyId, id);
		console.log(record);
		return { currentShipmentPaymentType: record };
	};

	const validateShipmentPaymentTypeForm = (shipmentPaymentType, setError) => {
		const errorList = [];
		const properties = ['name'];

		for (const property of properties) if (isEmpty(shipmentPaymentType[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentShipmentPaymentType]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setShipmentPaymentType({ ...shipmentPaymentType, ...currentShipmentPaymentType });
		setPrevShipmentPaymentType({ ...shipmentPaymentType, ...currentShipmentPaymentType });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedShipmentPaymentType({ mode: null, id: null });
		resetShipmentPaymentTypeForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedShipmentPaymentType({ mode: null, id: null });
			resetShipmentPaymentTypeForm();
		}
	};

	const createShipmentPaymentType = async () => {
		setLoader(true);

		try {
			const { name } = shipmentPaymentType;
			const ShipmentPaymentTypeObject = { companyId, userId, name: name };
			console.log(ShipmentPaymentTypeObject);

			const { isSuccess } = await ShipmentPaymentTypeService.create(ShipmentPaymentTypeObject);

			// if (isSuccess) {
			// 	setAlertSuccess(SHIPMENT_PAYMENT_TYPE_ALERT.Success.ShipmentPaymentTypeCreated);
			// 	queryClient.invalidateQueries({ queryKey: ['ShipmentPaymentType'] });
			// 	setOpenPanel(false);
			// 	resetShipmentPaymentTypeForm();
			// }
			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['shipmentPaymentType'] });
				setAlertSuccess(SHIPMENT_PAYMENT_TYPE_ALERT.Success.ShipmentPaymentTypeCreated);
				setOpenPanel(false);
				resetShipmentPaymentTypeForm();
			}
		} catch (error) {
			setAlertError(SHIPMENT_PAYMENT_TYPE_ALERT.Error.ShipmentPaymentTypeCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateShipmentPaymentType = async () => {
		setLoader(true);
		try {
			const { name } = shipmentPaymentType;
			const ShipmentPaymentTypeObject = { id, userId, name: name, ...shipmentPaymentType };
			console.log(ShipmentPaymentTypeObject);

			const { isSuccess } = await ShipmentPaymentTypeService.update(ShipmentPaymentTypeObject);

			if (isSuccess) {
				setAlertSuccess(SHIPMENT_PAYMENT_TYPE_ALERT.Success.ShipmentPaymentTypeUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['shipmentPaymentType'] });
				setSelectedShipmentPaymentType({ mode: null, id: null });
				resetShipmentPaymentTypeForm();
			}
		} catch (error) {
			setAlertError(SHIPMENT_PAYMENT_TYPE_ALERT.Error.ShipmentPaymentTypeUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeleteShipmentPaymentType = async () => {
		setDeleteLoader(true);

		try {
			const ShipmentPaymentTypeObject = { id, userId };
			console.log(ShipmentPaymentTypeObject);
			const { isSuccess } = await ShipmentPaymentTypeService.remove(ShipmentPaymentTypeObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['shipmentPaymentType'] });
				setAlertSuccess(SHIPMENT_PAYMENT_TYPE_ALERT.Success.ShipmentPaymentTypeDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(SHIPMENT_PAYMENT_TYPE_ALERT.Error.ShipmentPaymentTypeDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		const isShipmentPaymentTypeValid = validateShipmentPaymentTypeForm(ShipmentPaymentType, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isShipmentPaymentTypeValid) return;

			if (isShipmentPaymentTypeValid) await createShipmentPaymentType();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(ShipmentPaymentType, prevShipmentPaymentType)) return setAlertWarning(SHIPMENT_PAYMENT_TYPE_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isShipmentPaymentTypeValid) return setAlertWarning(SHIPMENT_PAYMENT_TYPE_ALERT.Warning.ShipmentPaymentTypeUpdated);

			if (isShipmentPaymentTypeValid) await updateShipmentPaymentType();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{
					title: mode === OPERATION_MODE.Create ? 'Create Shipment Payment Type' : mode === OPERATION_MODE.Edit ? 'Edit Shipment Payment Type' : 'View Shipment Payment Type',
					titleCloseButton: false,
				}}
				panelContent={{
					content: <ShipmentPaymentTypeForm isFetching={isFetching} />,
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

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={handleDeleteShipmentPaymentType} loading={deleteLoader} />
		</>
	);
}

ShipmentPaymentType.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedShipmentPaymentType: PropTypes.object,
	setSelectedShipmentPaymentType: PropTypes.func,
};
