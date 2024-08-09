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
import EntityForm from '../forms/EntityForm';

// CONTEXTS
import { useEntity } from 'pages/adminCenter/entity/contexts/EntityContext';

// SERVICES
import EntityService from 'services/EntityService';

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { ENTITY_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| ENTITY ||============================== //

export default function Entity({ openPanel, setOpenPanel, openDeleteModal, setOpenDeleteModal, selectedEntity: { mode = null, id = null }, setSelectedEntity }) {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const { entity, setEntity, setError, loader, setLoader, setMode, prevEntity, setPrevEntity, resetEntityForm } = useEntity();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentEntity },
		isFetching,
	} = useQuery({
		queryKey: ['entity', id],
		queryFn: () => getEntityById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentEntity: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(ENTITY_ALERT.Error.GetEntity),
	});

	const getEntityById = async () => {
		const { data: { record = {} } = {} } = await EntityService.getById(companyId, id);
		console.log(record);
		return { currentEntity: record };
	};

	const validateEntityForm = (Entity, setError) => {
		const errorList = [];
		const properties = ['name'];

		for (const property of properties) if (isEmpty(Entity[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentEntity]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setEntity({ ...entity, ...currentEntity });
		setPrevEntity({ ...entity, ...currentEntity });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedEntity({ mode: null, id: null });
		resetEntityForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedEntity({ mode: null, id: null });
			resetEntityForm();
		}
	};

	const createEntity = async () => {
		setLoader(true);

		try {
			const entityObject = { companyId: companyId, userId: userId, ...entity };
			console.log(entityObject);

			const { isSuccess } = await EntityService.create(entityObject);

			if (isSuccess) {
				setAlertSuccess(ENTITY_ALERT.Success.EntityCreated);
				queryClient.invalidateQueries({ queryKey: ['entity'] });
				setOpenPanel(false);
				resetEntityForm();
			}
		} catch (error) {
			setAlertError(ENTITY_ALERT.Error.EntityCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateEntity = async () => {
		setLoader(true);
		try {
			const { id, name, status } = entity;

			const entityObject = { id, name, status, userId };
			console.log(entityObject);

			const { isSuccess } = await EntityService.update(entityObject);

			if (isSuccess) {
				setAlertSuccess(ENTITY_ALERT.Success.EntityUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['entity'] });
				setSelectedEntity({ mode: null, id: null });
				resetEntityForm();
			}
		} catch (error) {
			setAlertError(ENTITY_ALERT.Error.EntityUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeleteEntity = async () => {
		setDeleteLoader(true);

		try {
			const entityObject = { id, userId };
			console.log(entityObject);

			const { isSuccess } = await EntityService.remove(entityObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['entity'] });
				setAlertSuccess(ENTITY_ALERT.Success.EntityDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(ENTITY_ALERT.Error.EntityDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		const isEntityValid = validateEntityForm(entity, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isEntityValid) return;

			if (isEntityValid) await createEntity();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(entity, prevEntity)) return setAlertWarning(ENTITY_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isEntityValid) return setAlertWarning(ENTITY_ALERT.Warning.EntityUpdated);

			if (isEntityValid) await updateEntity();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{ title: mode === OPERATION_MODE.Create? 'Create Entity'
				: mode === OPERATION_MODE.Edit? 'Edit Entity'
				: 'View Entity',
			titleCloseButton: false}}
				panelContent={{
					content: <EntityForm isFetching={isFetching} />,
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

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={handleDeleteEntity} loading={deleteLoader} />
		</>
	);
}

Entity.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedEntity: PropTypes.object,
	setSelectedEntity: PropTypes.func,
};
