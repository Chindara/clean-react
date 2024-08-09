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
import UserForm from '../forms/UserForm';

// CONTEXTS
import { useUser } from 'pages/adminCenter/user/contexts/UserContext';
import { isValidEmail } from 'validations/regex';

// SERVICES
import UserService from 'services/UserService';

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { USER_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| USER ||============================== //

export default function User({ openPanel, setOpenPanel, openDeleteModal, setOpenDeleteModal, selectedUser: { mode = null, id = null }, setSelectedUser }) {
	const { userId, companyId, userType:logUserType } = useAuth();
	const queryClient = useQueryClient();
	const { user, setUser, setError, loader, setLoader, setMode, prevUser, setPrevUser, resetUserForm } = useUser();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentUser, currentRoles },
		isFetching,
	} = useQuery({
		queryKey: ['user', id],
		queryFn: () => getUserById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentUser: {}, currentRoles: [] },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(USER_ALERT.Error.GetUser),
	});

	const getUserById = async () => {
		const { data: { record = {} } = {} } = await UserService.getById(companyId, id);
		var test = await UserService.getById(companyId, id);
		console.log(test);
		return { currentUser: record, currentRoles: record.roles };
	};

	const validateUserForm = (user, setError) => {
		const errorList = [];
		const properties = ['firstName', 'lastName', 'email', 'mobile', 'roles'];
		console.log(logUserType)
		if (logUserType === 2) {
			properties.push('userType')
			// const index = properties.indexOf('userType');
			// if (index !== -1) {
			// 	properties.splice(index, 1);
			// }
		}

		console.log(properties)
		for (const property of properties) {

		// if (property === 'userType' && userType === 3) {
		// 	continue;
		// }

			if (isEmpty(user[property])) {
				errorList.push(`validate-${property}`);
			}
		}
	
		const mobileRegex = /^\+?\d{1,2}\d{9}$/;
		if (!mobileRegex.test(user.mobile)) {
			errorList.push(`validate-mobile-format`);
		}
	
		if (!isValidEmail(user.email)) {
			errorList.push('validate-email-format');
		}

	
		if (errorList.length) {
			setError(errorList);
			return false;
		}
	
		return true;
	};
	useEffect(() => {
		initStateSetter();
	}, [mode, currentUser, currentRoles]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		if (mode === OPERATION_MODE.Edit || mode === OPERATION_MODE.View) {
			console.log(currentRoles);
			const userRoles = currentRoles.reduce((accumulator, object) => [...accumulator, { label: object.name, value: object.id }], []);
			setUser({ ...user, ...currentUser, roles: userRoles });
			setPrevUser({ ...user, ...currentUser, roles: userRoles });
		}
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedUser({ mode: null, id: null });
		resetUserForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedUser({ mode: null, id: null });
			resetUserForm();
		}
	};

	const createUser = async () => {
		console.log('inside createUser');
		console.log(logUserType);
        console.log(mode);

		//setLoader(true);
		try {
			console.log('inside try');

			const { firstName, lastName, email, mobile, userType } = user;

			let userTypeToCreate = 0; 
			if (logUserType == 3 ) {
				userTypeToCreate = 4; // USER
			}
			if(logUserType === 2){
				userTypeToCreate=userType;
			}	
			console.log(userTypeToCreate);
			const userObject = {
				companyId: companyId,
				firstName: firstName,
				lastName: lastName,
				email: email,
				mobile: mobile,
				roles: user.roles.map((roleId) => roleId?.value),
				userId: userId,
				userType: userTypeToCreate,
			};
			console.log(userObject);
			console.log(user);

			const { isSuccess } = await UserService.create(userObject);

			if (isSuccess) {
				setAlertSuccess(USER_ALERT.Success.UserCreated);
				queryClient.invalidateQueries({ queryKey: ['user'] });
				setOpenPanel(false);
				resetUserForm();
			}
		} catch (error) {
			setAlertError(USER_ALERT.Error.UserCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateUser = async () => {
		setLoader(true);
		try {
			const { firstName, lastName, email, mobile, status, userType } = user;
			const userObject = {
				companyId: companyId,
				id: id,
				firstName: firstName,
				lastName: lastName,
				email: email,
				mobile: mobile,
				roles: user.roles.map((roleId) => roleId?.value),
				userId: userId,
				status: status,
				userType: userType,
			};

			console.log('updating', userObject);

			const { isSuccess } = await UserService.update(userObject);

			if (isSuccess) {
				setAlertSuccess(USER_ALERT.Success.UserUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['user'] });
				setSelectedUser({ mode: null, id: null });
				resetUserForm();
			}
		} catch (error) {
			setAlertError(USER_ALERT.Error.UserUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeleteUser = async () => {
		setDeleteLoader(true);

		try {
			const userObject = {userId ,id,companyId };
			console.log(userObject);
			const { isSuccess } = await UserService.remove(userObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['user'] });
				setAlertSuccess(USER_ALERT.Success.UserDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(USER_ALERT.Error.UserDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		event.preventDefault();
		console.log('done');
	
		try {
			const isUserValid = validateUserForm(user, setError, logUserType);
			console.log('Is user valid:', isUserValid);
	
			if (!isUserValid) {
				console.log('User input is not valid.');
				return;
			}
	
			if (mode === OPERATION_MODE.Create) {
				console.log('Creating user...');
				await createUser();
			}
	
			if (mode === OPERATION_MODE.Edit) {
				console.log('Updating user...');
				if (shallowEqual(user, prevUser)) {
					console.log('No changes detected.');
					return setAlertWarning(USER_ALERT.Warning.NoChange);
				}
	
				console.log('Updating user...');
				await updateUser();
			}
	
			// Additional operations can be added here if needed
	
		} catch (error) {
			console.error('Error in handleSubmit:', error);
		}
	};
	
	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{ title: mode === OPERATION_MODE.Create? 'Create User'
				: mode === OPERATION_MODE.Edit? 'Edit User'
				: 'View User',
			titleCloseButton: false}}
				panelContent={{
					content: <UserForm isFetching={isFetching} />,
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

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={handleDeleteUser} loading={deleteLoader} />
		</>
	);
}

User.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedUser: PropTypes.object,
	setSelectedUser: PropTypes.func,
};
