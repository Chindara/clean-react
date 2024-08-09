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
import CompanyForm from '../forms/CompanyForm';

// CONTEXTS
import { useCompany } from 'pages/adminCenter/company/contexts/CompanyContext';

// SERVICES
import CompanyService from 'services/CompanyService';

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { COMPANY_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';
import UserService from 'services/UserService';
import { setUserAgent } from 'react-device-detect';

// ==============================|| COMPANY ||============================== //

export default function Company({ openPanel, setOpenPanel, openDeleteModal, setOpenDeleteModal, selectedCompany: { mode = null, id = null }, setSelectedCompany }) {
	const queryClient = useQueryClient();
	const { companyId, userId } = useAuth();
	const { company, setCompany, setError, loader, setLoader, setMode, prevCompany, setPrevCompany, resetCompanyForm } = useCompany();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentCompany, currentAssignees },
		isFetching,
	} = useQuery({
		queryKey: ['company', id],
		queryFn: () => getCompanyById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentCompany: {}, currentAssignees: [] },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(COMPANY_ALERT.Error.GetCompany),
	});

	const getCompanyById = async () => {
		const { data: { record = {} } = {} } = await CompanyService.getById(id);

		return { currentCompany: record };
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentCompany]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.AssignUser) {
			//
		}

		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		if (mode === OPERATION_MODE.Edit || mode === OPERATION_MODE.View) {

			setCompany({ ...company, ...currentCompany });
			setPrevCompany({ ...company, ...currentCompany });
		}
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedCompany({ mode: null, id: null });
		resetCompanyForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedCompany({ mode: null, id: null });
			resetCompanyForm();
		}
	};

	const createCompany = async () => {
		setLoader(true);
		try {
			const companyObject = { parentId: companyId, ...company };

			const { isSuccess } = await CompanyService.create(companyObject);

			if (isSuccess) {
				setAlertSuccess(COMPANY_ALERT.Success.CompanyCreated);
				queryClient.invalidateQueries({ queryKey: ['company'] });
				setOpenPanel(false);
				resetCompanyForm();
			}
		} catch (error) {
			setAlertError(COMPANY_ALERT.Error.CompanyUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateCompany = async () => {
		setLoader(true);
		try {
			const companyObject = { companyId: id, ...company };

			const { isSuccess } = await CompanyService.update(companyObject);

			if (isSuccess) {
				setAlertSuccess(COMPANY_ALERT.Success.CompanyUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['company'] });
				setSelectedCompany({ mode: null, id: null });
				resetCompanyForm();
			}
		} catch (error) {
			setAlertError(COMPANY_ALERT.Error.CompanyUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeleteCompany = async () => {
		setDeleteLoader(true);

		try {
			const { isSuccess } = await CompanyService.deleteCompany({
				userId: Number(userId),
				id: id,
			});

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['company'] });
				setAlertSuccess(COMPANY_ALERT.Success.CompanyDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(COMPANY_ALERT.Error.CompanyDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const validateCompanyForm = (company, setError) => {
		const errorList = [];
		const properties = ['name', 'address', 'vatNo', 'brNo', 'companyId', 'isPurchaseBased'];

		for (const property of properties) if (isEmpty(company[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	const handleSubmit = async () => {
		const isCompanyValid = validateCompanyForm(company, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isCompanyValid) return;

			if (isCompanyValid) await createCompany();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(company, prevCompany)) 
				return setAlertWarning(COMPANY_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isCompanyValid) return setAlertWarning(COMPANY_ALERT.Warning.CompanyUpdated);

			if (isCompanyValid) await updateCompany();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{ title: mode === OPERATION_MODE.Create ? 'Create Company' : mode === OPERATION_MODE.Edit ? 'Edit Company' : 'View Company', titleCloseButton: false }}
				panelContent={{
					content: <CompanyForm isFetching={isFetching} />,
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

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={handleDeleteCompany} loading={deleteLoader} />
		</>
	);
}

Company.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedCompany: PropTypes.object,
	setSelectedCompany: PropTypes.func,
};
