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
import BeneficiaryForm from '../forms/BeneficiaryForm';

// CONTEXTS
import { useBeneficiary } from 'pages/adminCenter/beneficiary/contexts/BeneficiaryContext';

// SERVICES
import BeneficiaryService from 'services/BeneficiaryService';

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { BENEFICIARY_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| Beneficiary ||============================== //

export default function Beneficiary({ openPanel, setOpenPanel, openDeleteModal, setOpenDeleteModal, selectedBeneficiary: { mode = null, id = null }, setSelectedBeneficiary }) {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const { beneficiary, setBeneficiary, setError, loader, setLoader, setMode, prevBeneficiary, setPrevBeneficiary, resetBeneficiaryForm } = useBeneficiary();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentBeneficiary },
		isFetching,
	} = useQuery({
		queryKey: ['beneficiary', id],
		queryFn: () => getBeneficiaryById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentBeneficiary: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(BENEFICIARY_ALERT.Error.GetBeneficiary),
	});

	const getBeneficiaryById = async () => {
		const { data: { record = {} } = {} } = await BeneficiaryService.getById(companyId, id);
		console.log(record);
		return { currentBeneficiary: record };
	};

	const validateBeneficiaryForm = (beneficiary, setError) => {
		const errorList = [];
		const properties = ['name'];

		for (const property of properties) if (isEmpty(beneficiary[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentBeneficiary]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setBeneficiary({ ...beneficiary, ...currentBeneficiary });
		setPrevBeneficiary({ ...beneficiary, ...currentBeneficiary });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedBeneficiary({ mode: null, id: null });
		resetBeneficiaryForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedBeneficiary({ mode: null, id: null });
			resetBeneficiaryForm();
		}
	};

	const createBeneficiary = async () => {
		setLoader(true);

		try {
			const { name } = beneficiary;
			const beneficiaryObject = { companyId, userId, name: name };
			console.log(beneficiaryObject);

			const { isSuccess } = await BeneficiaryService.create(beneficiaryObject);

			if (isSuccess) {
				setAlertSuccess(BENEFICIARY_ALERT.Success.BeneficiaryCreated);
				queryClient.invalidateQueries({ queryKey: ['beneficiary'] });
				setOpenPanel(false);
				resetBeneficiaryForm();
			}
		} catch (error) {
			setAlertError(BENEFICIARY_ALERT.Error.BeneficiaryCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateBeneficiary = async () => {
		setLoader(true);
		try {
			const { name } = beneficiary;
			const beneficiaryObject = { id, userId, name: name, ...beneficiary };
			console.log(beneficiaryObject);

			const { isSuccess } = await BeneficiaryService.update(beneficiaryObject);

			if (isSuccess) {
				setAlertSuccess(BENEFICIARY_ALERT.Success.BeneficiaryUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['beneficiary'] });
				setSelectedBeneficiary({ mode: null, id: null });
				resetBeneficiaryForm();
			}
		} catch (error) {
			setAlertError(BENEFICIARY_ALERT.Error.BeneficiaryUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeleteBeneficiary = async () => {
		setDeleteLoader(true);

		try {
			const beneficiaryObject = { id, userId };
			console.log(beneficiaryObject);
			const { isSuccess } = await BeneficiaryService.remove(beneficiaryObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['beneficiary'] });
				setAlertSuccess(BENEFICIARY_ALERT.Success.BeneficiaryDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(BENEFICIARY_ALERT.Error.BeneficiaryDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		const isBeneficiaryValid = validateBeneficiaryForm(beneficiary, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isBeneficiaryValid) return;

			if (isBeneficiaryValid) await createBeneficiary();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(beneficiary, prevBeneficiary)) return setAlertWarning(BENEFICIARY_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isBeneficiaryValid) return setAlertWarning(BENEFICIARY_ALERT.Warning.BeneficiaryUpdated);

			if (isBeneficiaryValid) await updateBeneficiary();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{ title: mode === OPERATION_MODE.Create? 'Create Beneficiary'
				: mode === OPERATION_MODE.Edit? 'Edit Beneficiary'
				: 'View Beneficiary',
			titleCloseButton: false}}
				//panelHeader={{ title: 'Beneficiary', titleCloseButton: false }}
				panelContent={{
					content: <BeneficiaryForm isFetching={isFetching} />,
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

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={handleDeleteBeneficiary} loading={deleteLoader} />
		</>
	);
}

Beneficiary.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedBeneficiary: PropTypes.object,
	setSelectedBeneficiary: PropTypes.func,
};
