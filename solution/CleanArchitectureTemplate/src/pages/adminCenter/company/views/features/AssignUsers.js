import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// THIRD-PARTY
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { shallowEqual } from 'react-redux';

// PROJECT IMPORT
import Panel from 'components/ui/Panel';
import DeleteModel from 'components/ui/DeleteModel';
// import PanelFooter from 'components/ui/PanelFooter';
import ExitModel from 'components/ui/ExitModel';
import AssignUserForm from '../forms/AssignUserForm';

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
import PanelFooter from '../../components/panel-footer/PanelFooter';

// ==============================|| ASSIGN USER ||============================== //

export default function AssignUsers({ openPanel, setOpenPanel, selectedCompany: { mode = null, id = null }, setSelectedCompany }) {
	const { companyId, userId } = useAuth();
	const queryClient = useQueryClient();
	const { assignUser,setAssignUser,prevAssignUser,setPrevAssignUser, setError, loader, setLoader, setMode, resetAssignUserForm } = useCompany();
	const [openExitModal, setOpenExitModal] = useState(false);

	const {
		data: { currentAssignees },
		isFetching,
	} = useQuery({
		queryKey: ['assign-users', id],
		queryFn: () => getCompanyAssignedUsers(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentAssignees: [] },
		onError: () => setAlertError(COMPANY_ALERT.Error.GetCompany),
	});

	const getCompanyAssignedUsers = async () => {
		const { data } = await CompanyService.getCompanyAssignedUsersById(id);
		console.log(data);
		return { currentAssignees: data };
	};

	const validateAssignUserForm = (company, setError) => {
		const errorList = [];
		const properties = ['assignees'];

		for (const property of properties) if (isEmpty(company[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode,currentAssignees]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.AssignUser) {
		console.log(currentAssignees);
		const assignedUsers = currentAssignees.reduce((accumulator, object) => [...accumulator, { label: object.name, value: object.id }], []);
		setAssignUser({ ...assignUser, ...currentAssignees, assignees: assignedUsers });

		//setAssignUser((prevState) => ({ ...prevState, assignees: assignedUsers }));
		setPrevAssignUser({ ...assignUser, ...currentAssignees, assignees: assignedUsers });
	}};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedCompany({ mode: null, id: null });
		resetAssignUserForm();
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedCompany({ mode: null, id: null });
			resetAssignUserForm();
		}
	};

	// const createAssignUser = async () => {
	// 	setLoader(true);
	// 	try {
	// 		const assignUserObject = {
	// 			id,
	// 			userId: userId,
	// 			assignees: assignUser.assignees.map((assigneesId) => assigneesId?.value),
	// 		};

	// 		console.log(assignUserObject);

	// 		const { isSuccess } = await CompanyService.Users(assignUserObject);

	// 		if (isSuccess) {
	// 			setAlertSuccess(COMPANY_ALERT.Success.AssignUserCreated);
	// 			queryClient.invalidateQueries({ queryKey: ['assign-users'] });
	// 			setOpenPanel(false);
	// 			resetAssignUserForm();
	// 		}
	// 	} catch (error) {
	// 		setAlertError(COMPANY_ALERT.Error.UsersAssigned);
	// 	} finally {
	// 		setTimeout(() => setLoader(false), 2200);
	// 	}
	// };

	const updateAssignUser = async () => {
		setLoader(true);
		try {
			const assignUserObject = {
				id,
				userId: companyId,
				assignees: assignUser.assignees.map((assigneesId) => assigneesId?.value),
			};
			console.log(assignUserObject);

			const { isSuccess } = await CompanyService.Users(assignUserObject);

			if (isSuccess) {
				setAlertSuccess(COMPANY_ALERT.Success.AssignUserUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['assign-users'] });
				setSelectedCompany({ mode: null, id: null });
				resetAssignUserForm();
			}
		} catch (error) {
			setAlertError(COMPANY_ALERT.Error.AssignUserUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	// const handleDeleteAssignUser = async () => {
	// 	setDeleteLoader(true);

	// 	try {
	// 		const assignUserObject = {
	// 			id,
	// 			userId: companyId,
	// 			assignees: assignUser.assignees.map((assigneesId) => assigneesId?.value),
	// 		};
	// 		console.log(assignUserObject);

	// 		const { isSuccess } = await CompanyService.remove(assignUserObject);

	// 		if (isSuccess) {
	// 			queryClient.invalidateQueries({ queryKey: ['assign-users'] });
	// 			setAlertSuccess(COMPANY_ALERT.Success.AssignUserDeleted);
	// 			setOpenPanel(false);
	// 		}
	// 		setOpenDeleteModal(false);
	// 	} catch (error) {
	// 		setAlertError(COMPANY_ALERT.Error.AssignUserDeleted);
	// 	} finally {
	// 		setDeleteLoader(false);
	// 	}
	// };

	const handleSubmit = async () => {
		try {
			const isAssignUserValid = validateAssignUserForm(assignUser, setError);
			console.log(isAssignUserValid);
	
			if (mode === OPERATION_MODE.AssignUser) {
				if (!isAssignUserValid) return;

				// console.log('Creating user...');
				// await validateAssignUserForm();
				console.log(assignUser)
				if (shallowEqual(assignUser, prevAssignUser)) {
					console.log('No changes detected.');
					return setAlertWarning(COMPANY_ALERT.Warning.NoChange);
				}
	
				if (!isAssignUserValid) {
					console.log('Form data is not valid.');
					return setAlertWarning(COMPANY_ALERT.Warning.FormInvalid);
				}
	
				console.log('Updating Assign user...');
				await updateAssignUser();
			}
	
		} catch (error) {
			console.error('Error in handleSubmit:', error);
		}
	};
	
	// if (mode === OPERATION_MODE.AssignUser) {
	// 	if (!isAssignUserValid) return;

	// 	if (isAssignUserValid) await assignUsers();
	// }
	// console.log(isAssignUserValid);

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{ title: 'Company Maintenance', titleCloseButton: false }}
				panelContent={{
					content: <AssignUserForm isFetching={isFetching} />,
					contentDivider: true,
				}}
				panelFooter={{
					footer: true,
					footerContent: (
						<PanelFooter
							footerMode={mode}
							buttonLoader={loader}
							handleSubmit={handleSubmit}
							handlePanelClose={handlePanelClose}
							handlePanelCancel={handleExitModal}
						/>
					),
				}}
			/>
			<ExitModel openModal={openExitModal} handleModalClose={handleExitModal} />
		</>
	);
}

AssignUsers.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	selectedCompany: PropTypes.object,
	setSelectedCompany: PropTypes.func,
};
