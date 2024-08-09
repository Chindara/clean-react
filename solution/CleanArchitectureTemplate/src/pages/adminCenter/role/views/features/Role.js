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
import RoleForm from '../forms/RoleForm';

// CONTEXTS
import { useRole } from 'pages/adminCenter/role/contexts/RoleContext';

// SERVICES
import RoleService from 'services/RoleService';

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { ROLE_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| ROLE ||============================== //

export default function Role({
	openPanel,
	setOpenPanel,
	openDeleteModal,
	setOpenDeleteModal,
	selectedRole: { mode = null, id = null },
	setSelectedRole,
}) {
	const queryClient = useQueryClient();
	const { userId, companyId } = useAuth();
	const { role, setRole, setError, loader, setLoader, setMode, prevRole, setPrevRole, resetRoleForm } =
		useRole();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentRole, currentFunctions },
		isFetching,
	} = useQuery({
		queryKey: ['role', id],
		queryFn: () => getRoleById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentRole: {}, currentFunctions: [] },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(ROLE_ALERT.Error.GetRole),
	});

	const getRoleById = async () => {
		const { data: { record = {} } = {} } = await RoleService.getById(companyId, id);
		return { currentRole: record, currentFunctions: record.functions };
	};

	const validateRoleForm = (role, setError) => {
		const errorList = [];
		const properties = ['name','function'];

		for (const property of properties) if (isEmpty(role[property])) errorList.push(`validate-${property}`);
		console.log(errorList)
		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => { //ponumber are coming to qautocomplete
		initStateSetter();
	}, [mode, currentRole, currentFunctions]);

	const initStateSetter = () => {
		setMode(mode);
		console.log('test211');
		console.log('mode ', mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		if (mode === OPERATION_MODE.Edit || mode === OPERATION_MODE.View) {
			console.log('1');
			console.log(currentFunctions);
			const roleFunctions = currentFunctions.reduce(
				(accumulator, object) => [...accumulator, { label: object.name, value: object.id }],
				[]
			);
			console.log('3');
			console.log('currentRole ', currentRole);
			console.log('roleFunctions ', roleFunctions);

			console.log('2');
			setRole({ ...role, ...currentRole, function: roleFunctions });
			setPrevRole({ ...role, ...currentRole, function: roleFunctions });
		}
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedRole({ mode: null, id: null });
		resetRoleForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedRole({ mode: null, id: null });
			resetRoleForm();
		}
	};

	const createRole = async () => {
		setLoader(true);

		try {
			const { name } = role;
			const roleObject = {
				companyId,
				userId,
				name: name,
				functionIdList: role.function.map((functionId) => functionId?.value),
			};
			console.log(role);
			console.log(roleObject);

			const { isSuccess } = await RoleService.create(roleObject);

			if (isSuccess) {
				setAlertSuccess(ROLE_ALERT.Success.RoleCreated);
				queryClient.invalidateQueries({ queryKey: ['role'] });
				setOpenPanel(false);
				resetRoleForm();
			}
		} catch (error) {
			setAlertError(ROLE_ALERT.Error.RoleCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateRole = async () => {
		setLoader(true);
		try {
			const { name, id, status } = role;
			const roleObject = {
				userId: userId,
				roleId: id,
				companyId: companyId,
				name: name,
				functionIdList: role.function.map((functionId) => functionId?.value),
				status: status,
			};
			console.log('updating', roleObject);

			const { isSuccess } = await RoleService.update(roleObject);

			if (isSuccess) {
				setAlertSuccess(ROLE_ALERT.Success.RoleUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['role'] });
				setSelectedRole({ mode: null, id: null });
				resetRoleForm();
			}
		} catch (error) {
			setAlertError(ROLE_ALERT.Error.RoleUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeleteRole = async () => {
		console.log("Deleting company...");
		setDeleteLoader(true);

		try {
			const roleObject = {
				userId: userId,
				roleId: id,
				companyId: companyId,
			};
			console.log(roleObject);

			const { isSuccess } = await RoleService.remove(roleObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['role'] });
				setAlertSuccess(ROLE_ALERT.Success.RoleDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(ROLE_ALERT.Error.RoleDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		console.log('done');

		try {
			const isRoleValid = validateRoleForm(role, setError);
			console.log('Is role valid:', isRoleValid);

			if (mode === OPERATION_MODE.Create) {
				if (!isRoleValid) return;

				console.log('Creating role...');
				await createRole();
			}

			if (mode === OPERATION_MODE.Edit) {
				if (shallowEqual(role, prevRole)) {
					console.log('No changes detected.');
					return setAlertWarning(ROLE_ALERT.Warning.NoChange);
				}

				if (!isRoleValid) {
					console.log('Role not valid for update.');
					return setAlertWarning(ROLE_ALERT.Warning.RoleUpdated);
				}

				console.log('Updating role...');
				await updateRole();
			}
		} catch (error) {
			console.error('Error in handleSubmit:', error);
		}
	};
	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{ title: mode === OPERATION_MODE.Create? 'Create Role'
						: mode === OPERATION_MODE.Edit? 'Edit Role'
						: 'View Role',
					titleCloseButton: false}}
				//panelHeader={{ title: 'Create Role', titleCloseButton: false }}
				panelContent={{
					content: <RoleForm isFetching={isFetching} />,
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

			<DeleteModel
				openModal={openDeleteModal}
				handleModalClose={handleDeleteModalClose}
				handleDelete={handleDeleteRole}
				loading={deleteLoader}
			/>
		</>
	);
}

Role.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedRole: PropTypes.object,
	setSelectedRole: PropTypes.func,
};
