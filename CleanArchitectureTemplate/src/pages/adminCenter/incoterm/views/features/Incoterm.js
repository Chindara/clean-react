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
import IncotermForm from '../forms/IncotermForm';

// CONTEXTS
import { useIncoterm } from 'pages/adminCenter/incoterm/contexts/IncotermContext';

// SERVICES
import IncotermService from 'services/IncotermService';

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { INCOTERM_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';


// ==============================|| INCOTERM ||============================== //

export default function Incoterm({ openPanel, setOpenPanel, openDeleteModal, setOpenDeleteModal, selectedIncoterm: { mode = null, id = null }, setSelectedIncoterm }) {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const { incoterm, setIncoterm, setError, loader, setLoader, setMode, prevIncoterm, setPrevIncoterm, resetIncotermForm } = useIncoterm();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentIncoterm },
		isFetching,
	} = useQuery({
		queryKey: ['incoterm', id],
		queryFn: () => getIncotermById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentIncoterm: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(INCOTERM_ALERT.Error.GetIncoterm),
	});

	const getIncotermById = async () => {
		const { data: { record = {} } = {} } = await IncotermService.getById(companyId, id);
		console.log(record);
		return { currentIncoterm: record };
	};

	const validateIncotermForm = (incoterm, setError) => {
		const errorList = [];
		const properties = ['name'];

		for (const property of properties) if (isEmpty(incoterm[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentIncoterm]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setIncoterm({ ...incoterm, ...currentIncoterm });
		setPrevIncoterm({ ...incoterm, ...currentIncoterm });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedIncoterm({ mode: null, id: null });
		resetIncotermForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedIncoterm({ mode: null, id: null });
			resetIncotermForm();
		}
	};

	const createIncoterm = async () => {
		setLoader(true);

		try {
			const incotermObject = { companyId: companyId, userId: userId, ...incoterm };
			console.log(incotermObject);

			const { isSuccess } = await IncotermService.create(incotermObject);

			if (isSuccess) {
				setAlertSuccess(INCOTERM_ALERT.Success.IncotermCreated);
				queryClient.invalidateQueries({ queryKey: ['incoterm'] });
				setOpenPanel(false);
				resetIncotermForm();
			}
		} catch (error) {
			setAlertError(INCOTERM_ALERT.Error.IncotermCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateIncoterm = async () => {
		setLoader(true);
		try {
			const { id, name, status } = incoterm;

			console.log(incoterm)

			const incotermObject = { id, name, status, userId };
			console.log(incotermObject);

			const { isSuccess } = await IncotermService.update(incotermObject);

			if (isSuccess) {
				setAlertSuccess(INCOTERM_ALERT.Success.IncotermUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['incoterm'] });
				setSelectedIncoterm({ mode: null, id: null });
				resetIncotermForm();
			}
		} catch (error) {
			setAlertError(INCOTERM_ALERT.Error.IncotermUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeleteIncoterm = async () => {
		setDeleteLoader(true);

		try {
			const incotermObject = { id, userId };
			console.log(incotermObject);

			const { isSuccess } = await IncotermService.remove(incotermObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['incoterm'] });
				setAlertSuccess(INCOTERM_ALERT.Success.IncotermDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(INCOTERM_ALERT.Error.IncotermDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		const isIncotermValid = validateIncotermForm(incoterm, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isIncotermValid) return;

			if (isIncotermValid) await createIncoterm();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(incoterm, prevIncoterm)) return setAlertWarning(INCOTERM_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isIncotermValid) return setAlertWarning(INCOTERM_ALERT.Warning.IncotermUpdated);

			if (isIncotermValid) await updateIncoterm();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{ title: mode === OPERATION_MODE.Create? 'Create Incoterm'
				: mode === OPERATION_MODE.Edit? 'Edit Incoterm'
				: 'View Incoterm',
			titleCloseButton: false}}
				panelContent={{
					content: <IncotermForm isFetching={isFetching} />,
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

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={handleDeleteIncoterm} loading={deleteLoader} />
		</>
	);
}

Incoterm.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedIncoterm: PropTypes.object,
	setSelectedIncoterm: PropTypes.func,
};
