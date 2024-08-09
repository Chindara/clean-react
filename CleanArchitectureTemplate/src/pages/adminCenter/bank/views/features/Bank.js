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
import BankForm from '../forms/BankForm';

// CONTEXTS
import { useBank } from 'pages/adminCenter/bank/contexts/BankContext';

// SERVICES
import BankService from 'services/BankService';

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { BANK_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| BANK ||============================== //

export default function Bank({ openPanel, setOpenPanel, openDeleteModal, setOpenDeleteModal, selectedBank: { mode = null, id = null }, setSelectedBank }) {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const { bank, setBank, setError, loader, setLoader, setMode, prevBank, setPrevBank, resetBankForm } = useBank();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentBank },
		isFetching,
	} = useQuery({
		queryKey: ['bank', id],
		queryFn: () => getBankById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentBank: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(BANK_ALERT.Error.GetBank),
	});

	const getBankById = async () => {
		const { data: { record = {} } = {} } = await BankService.getById(companyId, id);
		console.log(record);
		return { currentBank: record };
	};

	const validateBankForm = (bank, setError) => {
		const errorList = [];
		const properties = ['name'];

		for (const property of properties) if (isEmpty(bank[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentBank]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setBank({ ...bank, ...currentBank });
		setPrevBank({ ...bank, ...currentBank });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedBank({ mode: null, id: null });
		resetBankForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedBank({ mode: null, id: null });
			resetBankForm();
		}
	};

	const createBank = async () => {
		setLoader(true);

		try {
			const { name } = bank;
			const bankObject = { companyId, userId, name: name };
			console.log(bankObject);

			const { isSuccess } = await BankService.create(bankObject);

			if (isSuccess) {
				setAlertSuccess(BANK_ALERT.Success.BankCreated);
				queryClient.invalidateQueries({ queryKey: ['bank'] });
				setOpenPanel(false);
				resetBankForm();
			}
		} catch (error) {
			setAlertError(BANK_ALERT.Error.BankCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateBank = async () => {
		setLoader(true);
		try {
			const { name } = bank;
			const bankObject = { id, userId, name: name, ...bank };
			console.log(bankObject);

			const { isSuccess } = await BankService.update(bankObject);

			if (isSuccess) {
				setAlertSuccess(BANK_ALERT.Success.BankUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['bank'] });
				setSelectedBank({ mode: null, id: null });
				resetBankForm();
			}
		} catch (error) {
			setAlertError(BANK_ALERT.Error.BankUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeleteBank = async () => {
		setDeleteLoader(true);

		try {
			const bankObject = { id, userId };
			console.log(bankObject);
			const { isSuccess } = await BankService.remove(bankObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['bank'] });
				setAlertSuccess(BANK_ALERT.Success.BankDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(BANK_ALERT.Error.BankDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		const isBankValid = validateBankForm(bank, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isBankValid) return;

			if (isBankValid) await createBank();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(bank, prevBank)) return setAlertWarning(BANK_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isBankValid) return setAlertWarning(BANK_ALERT.Warning.BankUpdated);

			if (isBankValid) await updateBank();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{ title: mode === OPERATION_MODE.Create? 'Create Bank'
				: mode === OPERATION_MODE.Edit? 'Edit Bank'
				: 'View Bank',
			titleCloseButton: false}}
				//panelHeader={{ title: 'Bank', titleCloseButton: false }}
				panelContent={{
					content: <BankForm isFetching={isFetching} />,
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

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={handleDeleteBank} loading={deleteLoader} />
		</>
	);
}

Bank.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedBank: PropTypes.object,
	setSelectedBank: PropTypes.func,
};
