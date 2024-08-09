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
import VendorForm from '../forms/VendorForm';

// CONTEXTS
import { useVendor } from 'pages/adminCenter/vendor/contexts/VendorContext';

// SERVICES
import VendorService from 'services/VendorService';

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { VENDOR_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| vendor ||============================== //

export default function Vendor({ openPanel, setOpenPanel, openDeleteModal, setOpenDeleteModal, selectedVendor: { mode = null, id = null }, setSelectedVendor }) {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const { vendor, setVendor, setError, loader, setLoader, setMode, prevVendor, setPrevVendor, resetVendorForm } = useVendor();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentVendor },
		isFetching,
	} = useQuery({
		queryKey: ['vendor', id],
		queryFn: () => getVendorById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentVendor: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(VENDOR_ALERT.Error.GetVendor),
	});

	const getVendorById = async () => {
		const { data: { record = {} } = {} } = await VendorService.getById(companyId, id);
		console.log(record);
		return { currentVendor: record };
	};

	const validateVendorForm = (vendor, setError) => {
		const errorList = [];
		const properties = ['name'];

		for (const property of properties) if (isEmpty(vendor[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentVendor]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setVendor({ ...vendor, ...currentVendor });
		setPrevVendor({ ...vendor, ...currentVendor });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedVendor({ mode: null, id: null });
		resetVendorForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedVendor({ mode: null, id: null });
			resetVendorForm();
		}
	};

	const createVendor = async () => {
		setLoader(true);

		try {
			const vendorObject = { companyId: companyId, userId: userId, ...vendor };
			console.log(vendorObject);

			const { isSuccess } = await VendorService.create(vendorObject);

			if (isSuccess) {
				setAlertSuccess(VENDOR_ALERT.Success.VendorCreated);
				queryClient.invalidateQueries({ queryKey: ['vendor'] });
				setOpenPanel(false);
				resetVendorForm();
			}
		} catch (error) {
			setAlertError(VENDOR_ALERT.Error.VendorCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateVendor = async () => {
		setLoader(true);
		try {
			const { id, name, status } = vendor;

			const vendorObject = { id, name, status, userId };
			console.log(vendorObject);

			const { isSuccess } = await VendorService.update(vendorObject);

			if (isSuccess) {
				setAlertSuccess(VENDOR_ALERT.Success.VendorUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['vendor'] });
				setSelectedVendor({ mode: null, id: null });
				resetVendorForm();
			}
		} catch (error) {
			setAlertError(VENDOR_ALERT.Error.VendorUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeleteVendor = async () => {
		setDeleteLoader(true);

		try {
			const vendorObject = { id, userId };
			console.log(vendorObject);

			const { isSuccess } = await VendorService.remove(vendorObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['vendor'] });
				setAlertSuccess(VENDOR_ALERT.Success.vendorDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(VENDOR_ALERT.Error.VendorDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		const isVendorValid = validateVendorForm(vendor, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isVendorValid) return;

			if (isVendorValid) await createVendor();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(vendor, prevVendor)) return setAlertWarning(VENDOR_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isVendorValid) return setAlertWarning(VENDOR_ALERT.Warning.VendorUpdated);

			if (isVendorValid) await updateVendor();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{ title: mode === OPERATION_MODE.Create? 'Create Vendor'
				: mode === OPERATION_MODE.Edit? 'Edit Vendor'
				: 'View Vendor',
			titleCloseButton: false}}
				panelContent={{
					content: <VendorForm isFetching={isFetching} />,
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

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={handleDeleteVendor} loading={deleteLoader} />
		</>
	);
}

Vendor.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedVendor: PropTypes.object,
	setSelectedVendor: PropTypes.func,
};
