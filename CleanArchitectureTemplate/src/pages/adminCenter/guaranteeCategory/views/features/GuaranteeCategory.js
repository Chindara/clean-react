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
import GuaranteeCategoryForm from '../forms/GuaranteeCategoryForm';

// CONTEXTS
import { useGuaranteeCategory } from 'pages/adminCenter/guaranteeCategory/contexts/GuaranteeCategoryContext';

// SERVICES

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';
import GuaranteeCategoryService from 'services/LicenseApprovalService';
import { GUARANTEE_CATEGORY_ALERT } from 'constants/AlertMessage';

// ==============================|| GuaranteeCategory ||============================== //

export default function GuaranteeCategory({
	openPanel,
	setOpenPanel,
	openDeleteModal,
	setOpenDeleteModal,
	selectedGuaranteeCategory: { mode = null, id = null },
	setSelectedGuaranteeCategory,
}) {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const { guaranteeCategory, setGuaranteeCategory, setError, loader, setLoader, setMode, prevGuaranteeCategory, setPrevGuaranteeCategory, resetGuaranteeCategoryForm } =
		useGuaranteeCategory();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentGuaranteeCategory },
		isFetching,
	} = useQuery({
		queryKey: ['GuaranteeCategory', id],
		queryFn: () => getGuaranteeCategoryById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentGuaranteeCategory: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(GUARANTEE_CATEGORY_ALERT.Error.GetGuaranteeCategory),
	});

	const getGuaranteeCategoryById = async () => {
		const { data: { record = {} } = {} } = await GuaranteeCategoryService.getById(companyId, id);
		console.log(record);
		return { currentGuaranteeCategory: record };
	};

	const validateGuaranteeCategoryForm = (guaranteeCategory, setError) => {
		const errorList = [];
		const properties = [];

		for (const property of properties) if (isEmpty(guaranteeCategory[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentGuaranteeCategory]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete || !currentGuaranteeCategory) return;

		setGuaranteeCategory({ ...guaranteeCategory, ...currentGuaranteeCategory });
		setPrevGuaranteeCategory({ ...guaranteeCategory, ...currentGuaranteeCategory });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedGuaranteeCategory({ mode: null, id: null });
		resetGuaranteeCategoryForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedGuaranteeCategory({ mode: null, id: null });
			resetGuaranteeCategoryForm();
		}
	};

	const createGuaranteeCategory = async () => {
		setLoader(true);

		try {
			const { name } = guaranteeCategory;
			const GuaranteeCategoryObject = { companyId, userId, name: name };
			console.log(GuaranteeCategoryObject);

			const { isSuccess } = await GuaranteeCategoryService.create(GuaranteeCategoryObject);

			if (isSuccess) {
				setAlertSuccess(GUARANTEE_CATEGORY_ALERT.Success.GuaranteeCategoryCreated);
				queryClient.invalidateQueries({ queryKey: ['GuaranteeCategory'] });
				setOpenPanel(false);
				resetGuaranteeCategoryForm();
			}
		} catch (error) {
			setAlertError(GUARANTEE_CATEGORY_ALERT.Error.GuaranteeCategoryCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateGuaranteeCategory = async () => {
		setLoader(true);
		try {
			const { id, name, status } = guaranteeCategory;
			const GuaranteeCategoryObject = { id, userId, name, status };
			console.log(GuaranteeCategoryObject);

			const { isSuccess } = await GuaranteeCategoryService.update(GuaranteeCategoryObject);

			if (isSuccess) {
				setAlertSuccess(GUARANTEE_CATEGORY_ALERT.Success.GuaranteeCategoryUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['GuaranteeCategory'] });
				setSelectedGuaranteeCategory({ mode: null, id: null });
				resetGuaranteeCategoryForm();
			}
		} catch (error) {
			setAlertError(GUARANTEE_CATEGORY_ALERT.Error.GuaranteeCategoryUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeleteGuaranteeCategory = async () => {
		setDeleteLoader(true);

		try {
			const GuaranteeCategoryObject = { id, userId };
			console.log(GuaranteeCategoryObject);
			const { isSuccess } = await GuaranteeCategoryService.remove(GuaranteeCategoryObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['GuaranteeCategory'] });
				setAlertSuccess(GUARANTEE_CATEGORY_ALERT.Success.GuaranteeCategoryDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(GUARANTEE_CATEGORY_ALERT.Error.GuaranteeCategoryDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		const isGuaranteeCategoryValid = validateGuaranteeCategoryForm(guaranteeCategory, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isGuaranteeCategoryValid) return;

			if (isGuaranteeCategoryValid) await createGuaranteeCategory();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(GuaranteeCategory, prevGuaranteeCategory)) return setAlertWarning(GUARANTEE_CATEGORY_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isGuaranteeCategoryValid) return setAlertWarning(GUARANTEE_CATEGORY_ALERT.Warning.GuaranteeCategoryUpdated);

			if (isGuaranteeCategoryValid) await updateGuaranteeCategory();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{
					title: mode === OPERATION_MODE.Create ? 'Create Guarantee Category' : mode === OPERATION_MODE.Edit ? 'Edit Guarantee Category' : 'View Guarantee Category',
					titleCloseButton: false,
				}}
				panelContent={{
					content: <GuaranteeCategoryForm isFetching={isFetching} />,
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

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={handleDeleteGuaranteeCategory} loading={deleteLoader} />
		</>
	);
}

GuaranteeCategory.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedGuaranteeCategory: PropTypes.object,
	setSelectedGuaranteeCategory: PropTypes.func,
};
