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
import SubPaymentMethodForm from '../forms/SubPaymentMethodForm';

// CONTEXTS
import { useSubPaymentMethod } from 'pages/adminCenter/subPaymentMethod/contexts/SubPaymentMethodContext';

// SERVICES
import SubPaymentMethodService from 'services/SubPaymentMethodService';

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { SUB_PAYMENT_METHOD_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| subPaymentMethod ||============================== //

export default function SubPaymentMethod({ openPanel, setOpenPanel, openDeleteModal, setOpenDeleteModal, selectedSubPaymentMethod: { mode = null, id = null }, setSelectedSubPaymentMethod }) {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const { subPaymentMethod, setSubPaymentMethod, setError, loader, setLoader, setMode, prevSubPaymentMethod, setPrevSubPaymentMethod, resetSubPaymentMethodForm } = useSubPaymentMethod();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentSubPaymentMethod },
		isFetching,
	} = useQuery({
		queryKey: ['subPaymentMethod', id],
		queryFn: () => getSubPaymentMethodById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentSubPaymentMethod: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(SUB_PAYMENT_METHOD_ALERT.Error.GetSubPaymentMethod),
	});

	const getSubPaymentMethodById = async () => {
		const { data: { record = {} } = {} } = await SubPaymentMethodService.getById(companyId, id);
		console.log(record);
		return { currentSubPaymentMethod: record };
	};

	const validateSubPaymentMethodForm = (subPaymentMethod, setError) => {
		console.log(subPaymentMethod)
		const errorList = [];
		const properties = [ 'type', 'name'];

		for (const property of properties) if (isEmpty(subPaymentMethod[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentSubPaymentMethod]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setSubPaymentMethod({ ...subPaymentMethod, ...currentSubPaymentMethod });
		setPrevSubPaymentMethod({ ...subPaymentMethod, ...currentSubPaymentMethod });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedSubPaymentMethod({ mode: null, id: null });
		resetSubPaymentMethodForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedSubPaymentMethod({ mode: null, id: null });
			resetSubPaymentMethodForm();
		}
	};

	const createSubPaymentMethod = async () => {
		setLoader(true);

		try {
			const subPaymentMethodObject = { companyId: companyId, userId: userId, ...subPaymentMethod };
			console.log(subPaymentMethodObject);

			const { isSuccess } = await SubPaymentMethodService.create(subPaymentMethodObject);

			if (isSuccess) {
				setAlertSuccess(SUB_PAYMENT_METHOD_ALERT.Success.SubPaymentMethodCreated);
				queryClient.invalidateQueries({ queryKey: ['subPaymentMethod'] });
				setOpenPanel(false);
				resetSubPaymentMethodForm();
			}
		} catch (error) {
			setAlertError(SUB_PAYMENT_METHOD_ALERT.Error.SubPaymentMethodCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateSubPaymentMethod = async () => {
		setLoader(true);
		try {
			const { id, type ,name, status } = subPaymentMethod;

			console.log(subPaymentMethod)

			const subPaymentMethodObject = { id, type ,name, status, userId };
			console.log(subPaymentMethodObject);

			const { isSuccess } = await SubPaymentMethodService.update(subPaymentMethodObject);

			if (isSuccess) {
				setAlertSuccess(SUB_PAYMENT_METHOD_ALERT.Success.SubPaymentMethodUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['subPaymentMethod'] });
				setSelectedSubPaymentMethod({ mode: null, id: null });
				resetSubPaymentMethodForm();
			}
		} catch (error) {
			setAlertError(SUB_PAYMENT_METHOD_ALERT.Error.SubPaymentMethodUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeleteSubPaymentMethod = async () => {
		setDeleteLoader(true);

		try {
			const subPaymentMethodObject = { id, userId , companyId };
			console.log(subPaymentMethodObject);

			const { isSuccess } = await SubPaymentMethodService.remove(subPaymentMethodObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['subPaymentMethod'] });
				setAlertSuccess(SUB_PAYMENT_METHOD_ALERT.Success.SubPaymentMethodDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(SUB_PAYMENT_METHOD_ALERT.Error.SubPaymentMethodDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		const isSubPaymentMethodValid = validateSubPaymentMethodForm(subPaymentMethod, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isSubPaymentMethodValid) return;

			if (isSubPaymentMethodValid) await createSubPaymentMethod();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(subPaymentMethod, prevSubPaymentMethod)) return setAlertWarning(SUB_PAYMENT_METHOD_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isSubPaymentMethodValid) return setAlertWarning(SUB_PAYMENT_METHOD_ALERT.Warning.SubPaymentMethodUpdated);

			if (isSubPaymentMethodValid) await updateSubPaymentMethod();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{ title: mode === OPERATION_MODE.Create? 'Create SubPaymentMethod'
				: mode === OPERATION_MODE.Edit? 'Edit SubPaymentMethod'
				: 'View SubPaymentMethod',
			titleCloseButton: false}}
				panelContent={{
					content: <SubPaymentMethodForm isFetching={isFetching} />,
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

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={handleDeleteSubPaymentMethod} loading={deleteLoader} />
		</>
	);
}

SubPaymentMethod.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedSubPaymentMethod: PropTypes.object,
	setSelectedSubPaymentMethod: PropTypes.func,
};
