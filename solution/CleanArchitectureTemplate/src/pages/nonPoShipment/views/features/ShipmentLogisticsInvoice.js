import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// THIRD-PARTY
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { shallowEqual } from 'react-redux';

// PROJECT IMPORT
import Panel from 'components/ui/Panel';
import DeleteModel from 'components/ui/DeleteModel';
import PanelFooter from 'components/ui/PanelFooter';
import ExitModel from 'components/ui/ExitModel';
import LogisticsInvoiceForm from '../forms/ShipmentLogisticsInvoiceForm';

// CONTEXTS
import { useNonPoShipment } from '../../contexts/NonPoShipmentContext';

// SERVICES
import ShipmentLogisticsInvoiceService from 'services/ShipmentLogisticsInvoiceService';

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { SHIPMENT_LOGISTICS_INVOICES_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| LogisticsInvoice ||============================== //

export default function LogisticsInvoice({
	openPanel,
	setOpenPanel,
	selectedLogisticsInvoice: { mode = null, id = null },
	setSelectedLogisticsInvoice,
	openDeleteModal,
	setOpenDeleteModal,
	shipment,
}) {
	const navigate = useNavigate();
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();

	const { logisticsInvoice, setLogisticsInvoice, error, setError, loader, setLoader, setMode, prevLogisticsInvoice, setPrevLogisticsInvoice, resetLogisticsInvoiceForm } =
		useNonPoShipment();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentLogisticsInvoice },
		isFetching,
	} = useQuery({
		queryKey: ['logisticsInvoice', id],
		queryFn: () => getLogisticsInvoiceById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentLogisticsInvoice: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(SHIPMENT_LOGISTICS_INVOICES_ALERT.Error.GetShipmentLogisticsInvoice),
	});

	const getLogisticsInvoiceById = async () => {
		const { data: { record = {} } = {} } = await ShipmentLogisticsInvoiceService.getById(companyId, id);
		console.log(record);
		return { currentLogisticsInvoice: record };
	};

	const validateLogisticsInvoiceForm = (logisticsInvoice, setError) => {
		const errorList = [];
		const properties = [
			'category',
			'type',
			'amount',
			'currency',
			'beneficiary',
			'paymentSubmittedDate',
			'paymentDueDate',
			'invoiceDate',
			'invoiceReceivedDate',
			'paymentReference',
			'paymentDate',
			'logisticsInvoiceDate',
			'remark',
		];

		for (const property of properties) if (isEmpty(logisticsInvoice[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentLogisticsInvoice]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setLogisticsInvoice({ ...logisticsInvoice, ...currentLogisticsInvoice });
		setPrevLogisticsInvoice({ ...logisticsInvoice, ...currentLogisticsInvoice });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedLogisticsInvoice({ mode: null, id: null });
		resetLogisticsInvoiceForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedLogisticsInvoice({ mode: null, id: null });
			resetLogisticsInvoiceForm();
		}
	};

	const createLogisticsInvoice = async () => {
		setLoader(true);

		try {
			console.log(shipment);
			const logisticsInvoiceObject = { companyId: companyId, userId: userId, ...logisticsInvoice, poId: shipment?.poId, shipmentId: shipment?.id };
			console.log(logisticsInvoiceObject);

			const { isSuccess } = await ShipmentLogisticsInvoiceService.create(logisticsInvoiceObject);

			if (isSuccess) {
				setAlertSuccess(SHIPMENT_LOGISTICS_INVOICES_ALERT.Success.ShipmentLogisticsInvoiceCreated);
				queryClient.invalidateQueries({ queryKey: ['shipmentLogisticsInvoice'] });
				setOpenPanel(false);
				resetLogisticsInvoiceForm();
			}
		} catch (error) {
			setAlertError(SHIPMENT_LOGISTICS_INVOICES_ALERT.Error.ShipmentLogisticsInvoiceCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateLogisticsInvoice = async () => {
		setLoader(true);
		try {
			const logisticsInvoiceObject = {
				id: id,
				companyId: companyId,
				userId: userId,
				shipmentId: shipment?.id,
				category: logisticsInvoice?.category,
				type: logisticsInvoice?.type,
				currency: logisticsInvoice?.currency,
				amount: logisticsInvoice?.amount,
				beneficiary: logisticsInvoice?.beneficiary,
				paymentSubmittedDate: logisticsInvoice?.paymentSubmittedDate,
				paymentDueDate: logisticsInvoice?.paymentDueDate,
				paymentDate: logisticsInvoice?.paymentDate,
				invoiceDate: logisticsInvoice?.invoiceDate,
				paymentReference: logisticsInvoice?.paymentReference,
				containerNo: logisticsInvoice?.containerNo,
				invoiceReceivedDate: logisticsInvoice?.invoiceReceivedDate,
				remark: logisticsInvoice?.remark,
			};

			const { isSuccess } = await ShipmentLogisticsInvoiceService.update(logisticsInvoiceObject);
			console.log(logisticsInvoiceObject);
			if (isSuccess) {
				setAlertSuccess(SHIPMENT_LOGISTICS_INVOICES_ALERT.Success.ShipmentLogisticsInvoiceUpdated);
				queryClient.invalidateQueries({ queryKey: ['shipmentLogisticsInvoice'] });
				setSelectedLogisticsInvoice({ mode: null, id: null });
				setOpenPanel(false);
				resetLogisticsInvoiceForm();
			}
		} catch (error) {
			setAlertError(SHIPMENT_LOGISTICS_INVOICES_ALERT.Error.ShipmentLogisticsInvoiceUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeleteCurrency = async () => {
		setDeleteLoader(true);

		try {
			const logisticsInvoiceObject = { id, userId };
			console.log(logisticsInvoiceObject);

			const { isSuccess } = await ShipmentLogisticsInvoiceService.remove(logisticsInvoiceObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['shipmentLogisticsInvoice'] });
				setAlertSuccess(SHIPMENT_LOGISTICS_INVOICES_ALERT.Success.ShipmentLogisticsInvoiceDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(SHIPMENT_LOGISTICS_INVOICES_ALERT.Error.ShipmentLogisticsInvoiceDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		const isLogisticsInvoiceValid = validateLogisticsInvoiceForm(logisticsInvoice, setError);
		if (mode === OPERATION_MODE.Create) {
			if (!isLogisticsInvoiceValid) return;

			if (isLogisticsInvoiceValid) await createLogisticsInvoice();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(logisticsInvoice, prevLogisticsInvoice)) return setAlertWarning(SHIPMENT_LOGISTICS_INVOICES_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isLogisticsInvoiceValid) return setAlertWarning(SHIPMENT_LOGISTICS_INVOICES_ALERT.Warning.CurrencyUpdated);

			if (isLogisticsInvoiceValid) await updateLogisticsInvoice();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{
					title: mode === OPERATION_MODE.Create ? 'Create Logistics Invoices' : mode === OPERATION_MODE.Edit ? 'Edit Logistics Invoices' : 'View Logistics Invoices',
					titleCloseButton: false,
				}}
				panelContent={{
					content: <LogisticsInvoiceForm isFetching={isFetching} />,
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

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={handleDeleteCurrency} loading={deleteLoader} />
		</>
	);
}

LogisticsInvoice.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedLogisticsInvoice: PropTypes.object,
	setSelectedLogisticsInvoice: PropTypes.func,
	shipment: PropTypes.object,
};
