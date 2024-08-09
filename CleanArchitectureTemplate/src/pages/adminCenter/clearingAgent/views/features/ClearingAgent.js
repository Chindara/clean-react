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
import ClearingAgentForm from '../forms/ClearingAgentForm';

// CONTEXTS
import { useClearingAgent } from 'pages/adminCenter/clearingAgent/contexts/ClearingAgentContext';

// SERVICES

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { CLEARING_AGENT_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';
import ClearingAgentService from 'services/ClearingAgentService';

// ==============================|| clearingAgent ||============================== //

export default function ClearingAgent({
	openPanel,
	setOpenPanel,
	openDeleteModal,
	setOpenDeleteModal,
	selectedClearingAgent: { mode = null, id = null },
	setSelectedClearingAgent,
}) {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const { clearingAgent, setClearingAgent, setError, loader, setLoader, setMode, prevClearingAgent, setPrevClearingAgent, resetClearingAgentForm } = useClearingAgent();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentClearingAgent },
		isFetching,
	} = useQuery({
		queryKey: ['clearingAgent', id],
		queryFn: () => getClearingAgentById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentClearingAgent: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(CLEARING_AGENT_ALERT.Error.GetClearingAgent),
	});

	const getClearingAgentById = async () => {
		const { data: { record = {} } = {} } = await ClearingAgentService.getById(companyId, id);
		console.log(record);
		return { currentClearingAgent: record };
	};

	const validateClearingAgentForm = (clearingAgent, setError) => {
		const errorList = [];
		const properties = ['name'];

		for (const property of properties) if (isEmpty(clearingAgent[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentClearingAgent]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setClearingAgent({ ...clearingAgent, ...currentClearingAgent });
		setPrevClearingAgent({ ...clearingAgent, ...currentClearingAgent });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedClearingAgent({ mode: null, id: null });
		resetClearingAgentForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedClearingAgent({ mode: null, id: null });
			resetClearingAgentForm();
		}
	};

	const createClearingAgent = async () => {
		setLoader(true);

		try {
			const { name } = clearingAgent;
			const clearingAgentObject = { companyId, userId, name: name };
			console.log(clearingAgentObject);

			const { isSuccess } = await ClearingAgentService.create(clearingAgentObject);

			if (isSuccess) {
				setAlertSuccess(CLEARING_AGENT_ALERT.Success.ClearingAgentCreated);
				queryClient.invalidateQueries({ queryKey: ['clearingAgent'] });
				setOpenPanel(false);
				resetClearingAgentForm();
			}
		} catch (error) {
			setAlertError(CLEARING_AGENT_ALERT.Error.ClearingAgentCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateClearingAgent = async () => {
		setLoader(true);
		try {
			const { name } = clearingAgent;
			const clearingAgentObject = { id, userId, name: name, ...clearingAgent };
			console.log(clearingAgentObject);

			const { isSuccess } = await ClearingAgentService.update(clearingAgentObject);

			if (isSuccess) {
				setAlertSuccess(CLEARING_AGENT_ALERT.Success.ClearingAgentUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['clearingAgent'] });
				setSelectedClearingAgent({ mode: null, id: null });
				resetClearingAgentForm();
			}
		} catch (error) {
			setAlertError(CLEARING_AGENT_ALERT.Error.ClearingAgentUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeleteClearingAgent = async () => {
		setDeleteLoader(true);

		try {
			const clearingAgentObject = { id, userId };
			console.log(clearingAgentObject);
			const { isSuccess } = await ClearingAgentService.remove(clearingAgentObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['clearingAgent'] });
				setAlertSuccess(CLEARING_AGENT_ALERT.Success.ClearingAgentDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(CLEARING_AGENT_ALERT.Error.ClearingAgentDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		const isClearingAgentValid = validateClearingAgentForm(clearingAgent, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isClearingAgentValid) return;

			if (isClearingAgentValid) await createClearingAgent();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(clearingAgent, prevClearingAgent)) return setAlertWarning(CLEARING_AGENT_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isClearingAgentValid) return setAlertWarning(CLEARING_AGENT_ALERT.Warning.ClearingAgentUpdated);

			if (isClearingAgentValid) await updateClearingAgent();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{ title: mode === OPERATION_MODE.Create? 'Create Clearing Agent'
				: mode === OPERATION_MODE.Edit? 'Edit Clearing Agent'
				: 'View Clearing Agent',
			titleCloseButton: false}}
				panelContent={{
					content: <ClearingAgentForm isFetching={isFetching} />,
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

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={handleDeleteClearingAgent} loading={deleteLoader} />
		</>
	);
}

ClearingAgent.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedClearingAgent: PropTypes.object,
	setSelectedClearingAgent: PropTypes.func,
};
