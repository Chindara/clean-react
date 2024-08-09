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
import PortForm from '../forms/PortForm';

// CONTEXTS
import { usePort } from 'pages/adminCenter/port/contexts/PortContext';

// SERVICES
import PortService from 'services/PortService';

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { PORT_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| PORT ||============================== //

export default function Port({ openPanel, setOpenPanel, openDeleteModal, setOpenDeleteModal, selectedPort: { mode = null, id = null }, setSelectedPort }) {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const { port, setPort, setError, loader, setLoader, setMode, prevPort, setPrevPort, resetPortForm } = usePort();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentPort },
		isFetching,
	} = useQuery({
		queryKey: ['port', id],
		queryFn: () => getPortById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentPort: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(PORT_ALERT.Error.GetPort),
	});

	const getPortById = async () => {
		const { data: { record = {} } = {} } = await PortService.getById(companyId, id);
		console.log(record);
		return { currentPort: record };
	};

	const validatePortForm = (port, setError) => {
		const errorList = [];
		const properties = ['name'];

		for (const property of properties) if (isEmpty(port[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentPort]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setPort({ ...port, ...currentPort });
		setPrevPort({ ...port, ...currentPort });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedPort({ mode: null, id: null });
		resetPortForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedPort({ mode: null, id: null });
			resetPortForm();
		}
	};

	const createPort = async () => {
		setLoader(true);

		try {
			const { name } = port;
			const portObject = { companyId, userId, name: name };
			console.log(portObject);

			const { isSuccess } = await PortService.create(portObject);

			if (isSuccess) {
				setAlertSuccess(PORT_ALERT.Success.PortCreated);
				queryClient.invalidateQueries({ queryKey: ['port'] });
				setOpenPanel(false);
				resetPortForm();
			}
		} catch (error) {
			setAlertError(PORT_ALERT.Error.PortCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updatePort = async () => {
		setLoader(true);
		try {
			const { name } = port;
			const portObject = { id, userId, name: name, ...port };
			console.log(portObject);

			const { isSuccess } = await PortService.update(portObject);

			if (isSuccess) {
				setAlertSuccess(PORT_ALERT.Success.PortUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['port'] });
				setSelectedPort({ mode: null, id: null });
				resetPortForm();
			}
		} catch (error) {
			setAlertError(PORT_ALERT.Error.PortUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeletePort = async () => {
		setDeleteLoader(true);

		try {
			const portObject = { id, userId };
			console.log(portObject);
			const { isSuccess } = await PortService.remove(portObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['port'] });
				setAlertSuccess(PORT_ALERT.Success.PortDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(PORT_ALERT.Error.PortDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		const isPortValid = validatePortForm(port, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isPortValid) return;

			if (isPortValid) await createPort();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(port, prevPort)) return setAlertWarning(PORT_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isPortValid) return setAlertWarning(PORT_ALERT.Warning.PortUpdated);

			if (isPortValid) await updatePort();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{ title: mode === OPERATION_MODE.Create? 'Create Port'
				: mode === OPERATION_MODE.Edit? 'Edit Port'
				: 'View Port',
			titleCloseButton: false}}
				//panelHeader={{ title: 'Port', titleCloseButton: false }}
				panelContent={{
					content: <PortForm isFetching={isFetching} />,
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

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={handleDeletePort} loading={deleteLoader} />
		</>
	);
}

Port.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedPort: PropTypes.object,
	setSelectedPort: PropTypes.func,
};
