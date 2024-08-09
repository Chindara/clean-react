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
import ShipmentCostCategoryForm from '../forms/ShipmentCostCategoryForm';

// CONTEXTS
import { useShipmentCostCategory } from 'pages/adminCenter/shipmentCostCategory/contexts/ShipmentCostCategoryContext';

// SERVICES

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { SHIPMENT_CATEGORY_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';
import ShipmentCostCategoryService from 'services/ShipmentCostCategoryService';

// ==============================|| ShipmentCostCategory ||============================== //

export default function ShipmentCostCategory({
	openPanel,
	setOpenPanel,
	openDeleteModal,
	setOpenDeleteModal,
	selectedShipmentCostCategory: { mode = null, id = null },
	setSelectedShipmentCostCategory,
}) {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const {
		shipmentCostCategory,
		setShipmentCostCategory,
		setError,
		loader,
		setLoader,
		setMode,
		prevShipmentCostCategory,
		setPrevShipmentCostCategory,
		resetShipmentCostCategoryForm,
	} = useShipmentCostCategory();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentShipmentCostCategory },
		isFetching,
	} = useQuery({
		queryKey: ['ShipmentCostCategory', id],
		queryFn: () => getShipmentCostCategoryById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentShipmentCostCategory: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(SHIPMENT_CATEGORY_ALERT.Error.GetShipmentCategory),
	});

	const getShipmentCostCategoryById = async () => {
		const { data: { record = {} } = {} } = await ShipmentCostCategoryService.getById(companyId, id);
		console.log(record);
		return { currentShipmentCostCategory: record };
	};

	const validateForm = (shipmentCostCategory, setError) => {
		const errorList = [];
		const properties = ['name'];

		for (const property of properties) if (isEmpty(shipmentCostCategory[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentShipmentCostCategory]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setShipmentCostCategory({ ...shipmentCostCategory, ...currentShipmentCostCategory });
		setPrevShipmentCostCategory({ ...shipmentCostCategory, ...currentShipmentCostCategory });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedShipmentCostCategory({ mode: null, id: null });
		resetShipmentCostCategoryForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedShipmentCostCategory({ mode: null, id: null });
			resetShipmentCostCategoryForm();
		}
	};

	const createRecord = async () => {
		setLoader(true);

		try {
			const { name } = shipmentCostCategory;
			const ShipmentCostCategoryObject = { companyId, userId, name: name };
			console.log(ShipmentCostCategoryObject);

			const { isSuccess } = await ShipmentCostCategoryService.create(ShipmentCostCategoryObject);

			if (isSuccess) {
				setAlertSuccess(SHIPMENT_CATEGORY_ALERT.Success.ShipmentCategoryCreated);
				queryClient.invalidateQueries({ queryKey: ['shipmentCostCategories'] });
				setOpenPanel(false);
				resetShipmentCostCategoryForm();
			}
		} catch (error) {
			setAlertError(SHIPMENT_CATEGORY_ALERT.Error.ShipmentCategoryCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateRecord = async () => {
		setLoader(true);
		try {
			const { name } = shipmentCostCategory;
			const ShipmentCategoryObject = { id, userId, name: name, ...shipmentCostCategory };
			console.log(ShipmentCategoryObject);

			const { isSuccess } = await ShipmentCostCategoryService.update(ShipmentCategoryObject);

			if (isSuccess) {
				setAlertSuccess(SHIPMENT_CATEGORY_ALERT.Success.ShipmentCategoryUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['shipmentCostCategories'] });
				setSelectedShipmentCostCategory({ mode: null, id: null });
				resetShipmentCostCategoryForm();
			}
		} catch (error) {
			setAlertError(SHIPMENT_CATEGORY_ALERT.Error.ShipmentCategoryUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const deleteRecord = async () => {
		setDeleteLoader(true);

		try {
			const ShipmentCostCategoryObject = { id, userId };
			console.log(ShipmentCostCategoryObject);
			const { isSuccess } = await ShipmentCostCategoryService.remove(ShipmentCostCategoryObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['shipmentCostCategories'] });
				setAlertSuccess(SHIPMENT_CATEGORY_ALERT.Success.ShipmentCategoryDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(SHIPMENT_CATEGORY_ALERT.Error.ShipmentCategoryDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		const isFormValid = validateForm(shipmentCostCategory, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isFormValid) return;

			if (isFormValid) await createRecord();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(ShipmentCostCategory, prevShipmentCostCategory)) return setAlertWarning(SHIPMENT_CATEGORY_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isFormValid) return setAlertWarning(SHIPMENT_CATEGORY_ALERT.Warning.ShipmentCategoryUpdated);

			if (isFormValid) await updateRecord();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{
					title: mode === OPERATION_MODE.Create ? 'Create Shipment Cost Category' : mode === OPERATION_MODE.Edit ? 'Edit Shipment Cost Category' : 'View Shipment Cost Category',
					titleCloseButton: false,
				}}
				panelContent={{
					content: <ShipmentCostCategoryForm isFetching={isFetching} />,
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

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={deleteRecord} loading={deleteLoader} />
		</>
	);
}

ShipmentCostCategory.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedShipmentCostCategory: PropTypes.object,
	setSelectedShipmentCostCategory: PropTypes.func,
};
