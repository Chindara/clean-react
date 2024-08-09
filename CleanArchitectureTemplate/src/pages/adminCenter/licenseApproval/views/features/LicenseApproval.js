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
import LicenseApprovalForm from '../forms/LicenseApprovalForm';

// CONTEXTS
import { useLicenseApproval } from 'pages/adminCenter/licenseApproval/contexts/LicenseApprovalContext';

// SERVICES

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';
import LicenseApprovalService from 'services/LicenseApprovalService';
import { LICENSE_APPROVAL_ALERT } from 'constants/AlertMessage';

// ==============================|| LicenseApproval ||============================== //

export default function LicenseApproval({
	openPanel,
	setOpenPanel,
	openDeleteModal,
	setOpenDeleteModal,
	selectedLicenseApproval: { mode = null, id = null },
	setSelectedLicenseApproval,
}) {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const { licenseApproval, setLicenseApproval, setError, loader, setLoader, setMode, prevLicenseApproval, setPrevLicenseApproval, resetLicenseApprovalForm } = useLicenseApproval();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentLicenseApproval },
		isFetching,
	} = useQuery({
		queryKey: ['LicenseApproval', id],
		queryFn: () => getLicenseApprovalById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentLicenseApproval: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(LICENSE_APPROVAL_ALERT.Error.GetLicenseApproval),
	});

	const getLicenseApprovalById = async () => {
		const { data: { record = {} } = {} } = await LicenseApprovalService.getById(companyId, id);
		console.log(record);
		return { currentLicenseApproval: record };
	};

	const validateLicenseApprovalForm = (licenseApproval, setError) => {
		const errorList = [];
		const properties = [];

		for (const property of properties) if (isEmpty(licenseApproval[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentLicenseApproval]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete || !currentLicenseApproval) return;

		setLicenseApproval({ ...licenseApproval, ...currentLicenseApproval });
		setPrevLicenseApproval({ ...licenseApproval, ...currentLicenseApproval });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedLicenseApproval({ mode: null, id: null });
		resetLicenseApprovalForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedLicenseApproval({ mode: null, id: null });
			resetLicenseApprovalForm();
		}
	};

	const createLicenseApproval = async () => {
		setLoader(true);

		try {
			const { name } = licenseApproval;
			const LicenseApprovalObject = { companyId, userId, name: name };
			console.log(LicenseApprovalObject);

			const { isSuccess } = await LicenseApprovalService.create(LicenseApprovalObject);

			if (isSuccess) {
				setAlertSuccess(LICENSE_APPROVAL_ALERT.Success.LicenseApprovalCreated);
				queryClient.invalidateQueries({ queryKey: ['LicenseApproval'] });
				setOpenPanel(false);
				resetLicenseApprovalForm();
			}
		} catch (error) {
			setAlertError(LICENSE_APPROVAL_ALERT.Error.LicenseApprovalCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateLicenseApproval = async () => {
		setLoader(true);
		try {
			const { id, name, status } = licenseApproval;
			const LicenseApprovalObject = { id, userId, name, status };
			console.log(LicenseApprovalObject);

			const { isSuccess } = await LicenseApprovalService.update(LicenseApprovalObject);

			if (isSuccess) {
				setAlertSuccess(LICENSE_APPROVAL_ALERT.Success.LicenseApprovalUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['LicenseApproval'] });
				setSelectedLicenseApproval({ mode: null, id: null });
				resetLicenseApprovalForm();
			}
		} catch (error) {
			setAlertError(LICENSE_APPROVAL_ALERT.Error.LicenseApprovalUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeleteLicenseApproval = async () => {
		setDeleteLoader(true);

		try {
			const LicenseApprovalObject = { id, userId };
			console.log(LicenseApprovalObject);
			const { isSuccess } = await LicenseApprovalService.remove(LicenseApprovalObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['LicenseApproval'] });
				setAlertSuccess(LICENSE_APPROVAL_ALERT.Success.LicenseApprovalDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(LICENSE_APPROVAL_ALERT.Error.LicenseApprovalDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		const isLicenseApprovalValid = validateLicenseApprovalForm(licenseApproval, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isLicenseApprovalValid) return;

			if (isLicenseApprovalValid) await createLicenseApproval();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(LicenseApproval, prevLicenseApproval)) return setAlertWarning(LICENSE_APPROVAL_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isLicenseApprovalValid) return setAlertWarning(LICENSE_APPROVAL_ALERT.Warning.LicenseApprovalUpdated);

			if (isLicenseApprovalValid) await updateLicenseApproval();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{
					title: mode === OPERATION_MODE.Create ? 'Create License Approval' : mode === OPERATION_MODE.Edit ? 'Edit License Approval' : 'View License Approval',
					titleCloseButton: false,
				}}
				panelContent={{
					content: <LicenseApprovalForm isFetching={isFetching} />,
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

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={handleDeleteLicenseApproval} loading={deleteLoader} />
		</>
	);
}

LicenseApproval.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedLicenseApproval: PropTypes.object,
	setSelectedLicenseApproval: PropTypes.func,
};
