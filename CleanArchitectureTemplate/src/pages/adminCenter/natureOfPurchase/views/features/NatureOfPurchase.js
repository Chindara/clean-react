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
import NatureOfPurchaseForm from '../forms/NatureOfPurchaseForm';

// CONTEXTS
import { useNatureOfPurchase } from 'pages/adminCenter/natureOfPurchase/contexts/NatureOfPurchaseContext';

// SERVICES
import NatureOfPurchaseService from 'services/NatureOfPurchaseService';

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { NATURE_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';
import natureOfPurchaseService from 'services/NatureOfPurchaseService';

// ==============================|| NatureOfPurchase ||============================== //

export default function NatureOfPurchase({
	openPanel,
	setOpenPanel,
	openDeleteModal,
	setOpenDeleteModal,
	selectedNatureOfPurchase: { mode = null, id = null },
	setSelectedNatureOfPurchase,
}) {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const { natureOfPurchase, setNatureOfPurchase, setError, loader, setLoader, setMode, prevNatureOfPurchase, setPrevNatureOfPurchase, resetNatureOfPurchaseForm } =
		useNatureOfPurchase();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentNatureOfPurchase },
		isFetching,
	} = useQuery({
		queryKey: ['natureOfPurchase', id],
		queryFn: () => getNatureOfPurchaseById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentNatureOfPurchase: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(NATURE_ALERT.Error.GetNatureOfPurchase),
	});

	const getNatureOfPurchaseById = async () => {
		const { data: { record = {} } = {} } = await natureOfPurchaseService.getById(companyId, id);
		console.log(record);
		return { currentNatureOfPurchase: record };
	};

	const validateNatureOfPurchaseForm = (natureOfPurchase, setError) => {
		const errorList = [];
		const properties = ['name'];

		for (const property of properties) if (isEmpty(natureOfPurchase[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentNatureOfPurchase]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setNatureOfPurchase({ ...natureOfPurchase, ...currentNatureOfPurchase });
		setPrevNatureOfPurchase({ ...natureOfPurchase, ...currentNatureOfPurchase });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedNatureOfPurchase({ mode: null, id: null });
		resetNatureOfPurchaseForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedNatureOfPurchase({ mode: null, id: null });
			resetNatureOfPurchaseForm();
		}
	};

	const createNatureOfPurchase = async () => {
		setLoader(true);

		try {
			const { name } = natureOfPurchase;
			const natureOfPurchaseObject = { companyId, userId, name: name };
			console.log(natureOfPurchaseObject);

			const { isSuccess } = await NatureOfPurchaseService.create(natureOfPurchaseObject);

			if (isSuccess) {
				setAlertSuccess(NATURE_ALERT.Success.NatureOfPurchaseCreated);
				queryClient.invalidateQueries({ queryKey: ['natureOfPurchase'] });
				setOpenPanel(false);
				resetNatureOfPurchaseForm();
			}
		} catch (error) {
			setAlertError(NATURE_ALERT.Error.NatureOfPurchaseCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateNatureOfPurchase = async () => {
		setLoader(true);
		try {
			const { name } = natureOfPurchase;
			const natureOfPurchaseObject = { id, userId, name: name, ...natureOfPurchase };
			console.log(natureOfPurchaseObject);

			const { isSuccess } = await NatureOfPurchaseService.update(natureOfPurchaseObject);

			if (isSuccess) {
				setAlertSuccess(NATURE_ALERT.Success.NatureOfPurchaseUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['natureOfPurchase'] });
				setSelectedNatureOfPurchase({ mode: null, id: null });
				resetNatureOfPurchaseForm();
			}
		} catch (error) {
			setAlertError(NATURE_ALERT.Error.NatureOfPurchaseUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeleteNatureOfPurchase = async () => {
		setDeleteLoader(true);

		try {
			const natureOfPurchaseObject = { id, userId };
			console.log(natureOfPurchaseObject);
			const { isSuccess } = await NatureOfPurchaseService.remove(natureOfPurchaseObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['natureOfPurchase'] });
				setAlertSuccess(NATURE_ALERT.Success.NatureOfPurchaseDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(NATURE_ALERT.Error.NatureOfPurchaseDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		const isNatureOfPurchaseValid = validateNatureOfPurchaseForm(natureOfPurchase, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isNatureOfPurchaseValid) return;

			if (isNatureOfPurchaseValid) await createNatureOfPurchase();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(natureOfPurchase, prevNatureOfPurchase)) return setAlertWarning(NATURE_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isNatureOfPurchaseValid) return setAlertWarning(NATURE_ALERT.Warning.NatureOfPurchaseUpdated);

			if (isNatureOfPurchaseValid) await updateNatureOfPurchase();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{
					title: mode === OPERATION_MODE.Create ? 'Create Nature of Purchase' : mode === OPERATION_MODE.Edit ? 'Edit Nature of Purchase' : 'View Nature of Purchase',
					titleCloseButton: false,
				}}
				//panelHeader={{ title: 'NatureOfPurchase', titleCloseButton: false }}
				panelContent={{
					content: <NatureOfPurchaseForm isFetching={isFetching} />,
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

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={handleDeleteNatureOfPurchase} loading={deleteLoader} />
		</>
	);
}

NatureOfPurchase.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedNatureOfPurchase: PropTypes.object,
	setSelectedNatureOfPurchase: PropTypes.func,
};
