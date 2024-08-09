import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// THIRD-PARTY
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useShipment } from '../../contexts/ShipmentsContext';
import ShipmentService from 'services/ShipmentService';
import { OPERATION_MODE } from 'constants/Types';
import { SHIPMENT_ALERT } from 'constants/AlertMessage';
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';
import { isEmpty } from 'validations/validation';
import { shallowEqual } from 'react-redux';
import ShipmentForm from '../forms/ShipmentForm';
import useAuth from 'hooks/useAuth';
import DeleteModel from 'components/ui/DeleteModel';
import UpdateStatusModel from 'pages/shipments/components/models/UpdateStatusModel';
import PurchaseOrderService from 'services/PurchaseOrderService';
import LookupService from 'services/LookupService';

export default function Shipment({ selectedShipment: { mode = null, id = null }, setSelectedShipment, openUpdateStatusModal, setOpenUpdateStatusModal }) {
	const navigate = useNavigate();
	const { userId, companyId } = useAuth();

	const queryClient = useQueryClient();
	const { shipment, setShipment, prevShipment, setPrevShipment, setError, setMode, loader, setLoader, resetShipmentForm } = useShipment();

	const [statusLoader, setStatusLoader] = useState(false);
	const [purchaseOrdersChoices, setPurchaseOrdersChoices] = useState([]);

	const {
		data: { currentShipment, additionalPoNumbers },
		isFetching,
	} = useQuery({
		queryKey: ['shipment', id],
		queryFn: () => getShipmentById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentShipment: {}, additionalPoNumbers: [] },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit || mode === OPERATION_MODE.Other || mode === OPERATION_MODE.ShipmentPayment) ? true : false,
		onError: () => setAlertError(SHIPMENT_ALERT.Error.GetShipment),
	});

	const getShipmentById = async () => {
		const { data: { record = {} } = {} } = await ShipmentService.getById(companyId, id);

		console.log(record);

		const [poId, ...purchaseOrdersValues] = record?.purchaseOrders || [];

		const purchaseOrder = await PurchaseOrderService.getById(companyId, poId);
		const purchaseOrders = await PurchaseOrderService.createNos(purchaseOrdersValues);
		const additionalPurchaseOrders = await LookupService.getPurchaseOrders(companyId, poId);

		const additionalPoNumbers = additionalPurchaseOrders.data.map((po) => ({ label: po.name, value: po.id }));
		const selectedAdditionalPoNumbers = purchaseOrders.data.map((po) => ({ label: po.name, value: po.id }));

		record.poId = poId;
		record.description = purchaseOrder?.data?.record?.description;
		record.vendor = purchaseOrder?.data?.record?.vendor;
		record.purchaseOrders = selectedAdditionalPoNumbers;
		record.totalAmount = purchaseOrder?.data?.record?.purchaseAmount;

		return { currentShipment: record, additionalPoNumbers };
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentShipment]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setShipment({ ...shipment, ...currentShipment });
		setPrevShipment({ ...shipment, ...currentShipment });
		setPurchaseOrdersChoices(additionalPoNumbers);
	};

	const validateForm = (shipment, setError) => {
		const errorList = [];
		const properties = ['poId', 'referenceNo', 'vendor', 'natureOfPurchase', 'typeOfCargo', 'description', 'currency', 'purchaseAmount', 'incoTerm', 'shipmentType'];

		for (const property of properties) if (isEmpty(shipment[property])) errorList.push(`validate-${property}`);

		if (!errorList.includes('validate-amount')) {
			const regex = /^\d*\.?\d*$/;

			if (!regex.test(shipment.amount) && parseFloat(shipment.amount) < 0) {
				errorList.push(`validate-amount-format`);
			}
		}

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	const handleUpdateModalClose = () => {
		setOpenUpdateStatusModal(false);
	};

	const handleStatusChange = async (status) => {
		setStatusLoader(true);
		try {
			const StatusObject = {
				companyId: companyId,
				userId: userId,
				shipmentId: id,
				status: status,
			};
			console.log(StatusObject);

			const { isSuccess } = await ShipmentService.updateStatus(StatusObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['shipment'] });
				setAlertSuccess(SHIPMENT_ALERT.Success.ShipmentUpdated);
				setSelectedShipment({ mode: null, id: null });
				resetShipmentForm();
			}
		} catch (error) {
			setAlertError(SHIPMENT_ALERT.Error.ShipmentUpdated);
		} finally {
			setTimeout(() => setStatusLoader(false), 2200);
		}
	};

	const createRecord = async () => {
		setLoader(true);
		try {
			const { purchaseOrders, poId, containerNumbers, purchaseAmount, ...rest } = shipment;

			const purchaseOrdersValues = purchaseOrders.map((po) => po.value);
			console.log(purchaseOrders);

			const totalAmount = purchaseOrders.reduce((accumulator, currentItem) => {
				return accumulator + currentItem.amount;
			}, 0);
			const finalAmount = totalAmount + purchaseAmount;

			const purchaseOrdersIds = [poId, ...purchaseOrdersValues];

			// Ensure containerNumbers is an array
			const normalizedContainerNumbers = Array.isArray(containerNumbers) ? containerNumbers : [containerNumbers];

			const shipmentObject = {
				companyId: companyId,
				userId: userId,
				purchaseOrders: purchaseOrdersIds,
				containerNumbers: normalizedContainerNumbers,
				purchaseAmount: finalAmount,
				...rest,
			};

			const { isSuccess } = await ShipmentService.create(shipmentObject);
			if (isSuccess) {
				setAlertSuccess(SHIPMENT_ALERT.Success.ShipmentCreated);
				resetShipmentForm();
				navigate(`..`);
			}
		} catch (error) {
			setAlertError(SHIPMENT_ALERT.Error.ShipmentCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateRecord = async () => {
		setLoader(true);
		try {
			const purchaseOrdersIds = shipment?.purchaseOrders.map((po) => po.value);

			const { purchaseOrders, purchaseAmount } = shipment;

			const totalAmount = purchaseOrders.reduce((accumulator, currentItem) => {
				return accumulator + currentItem.amount;
			}, 0);
			const finalAmount = totalAmount + purchaseAmount;

			const shipmentObject = {
				id: id,
				companyId: companyId,
				userId: userId,
				referenceNo: shipment?.referenceNo,
				purchaseOrders: [shipment?.poId, ...purchaseOrdersIds],
				description: shipment?.description,
				vendor: shipment?.vendor,
				natureOfPurchase: shipment?.natureOfPurchase,
				clearingAgent: shipment?.clearingAgent,
				currency: shipment?.currency,
				commercialInvoiceAmount: shipment?.commercialInvoiceAmount,
				purchaseAmount: finalAmount,
				weight: shipment?.weight,
				vessel: shipment?.vessel,
				incoTerm: shipment?.incoTerm,
				eta: shipment?.eta,
				docReceivedDateToSD: shipment?.docReceivedDateToSD,
				etd: shipment?.etd,
				documentsToCHA: shipment?.documentsToCHA,
				mawb: shipment?.mawb,
				portOfLoad: shipment?.portOfLoad,
				shippingLine: shipment?.shippingLine,
				shipmentType: shipment?.shipmentType,
				commercialInvoiceNo: shipment?.commercialInvoiceNo,
				blawbNo: shipment?.blawbNo,
				blawbStatus: shipment?.blawbStatus,
				cargoClearedDate: shipment?.cargoClearedDate,
				remarks: shipment?.remarks,
				cusdecNo: shipment?.cusdecNo,
				cusdecDate: shipment?.cusdecDate,
				portOfDischarge: shipment?.portOfDischarge,
				containerDeposit: shipment?.containerDeposit,
				demurrage: shipment?.demurrage,
				demurrageAmount: shipment?.demurrageAmount,
				demurrageReason: shipment?.demurrageReason,
				claimableAmount: shipment?.claimableAmount,
				claimedAmount: shipment?.claimedAmount,
				containerNumbers: [shipment?.containerNumbers],
				depositedAmount: shipment?.depositedAmount,
				acknowledgeDateToFinance: shipment?.acknowledgeDateToFinance,
				chequeReceivedDate: shipment?.chequeReceivedDate,
				chequeDepositedDate: shipment?.chequeDepositedDate,
				chequeNo: shipment?.chequeNo,
				deductedAmount: shipment?.deductedAmount,
				refundedAmount: shipment?.refundedAmount,
				cdRemarks: shipment?.cdRemarks,
				typeOfCargo: shipment?.typeOfCargo,
				//purchaseAmount: shipment?.purchaseAmount,
				acknowledgeInvoiceReceivedDate: shipment?.acknowledgeInvoiceReceivedDate,
				portDemurrageAmount: shipment?.portDemurrageAmount,
				reasonForPortDemurrage: shipment?.reasonForPortDemurrage,
				linearDemurrageAmount: shipment?.linearDemurrageAmount,
				reasonForLinearDemurrage: shipment?.reasonForLinearDemurrage,
				transportDetentionAmount: shipment?.transportDetentionAmount,
				reasonForTransportDetention: shipment?.reasonForTransportDetention,
				demurrageRemarks: shipment?.demurrageRemarks,
			};
			console.log(shipment)

			const { isSuccess } = await ShipmentService.update(shipmentObject);

			if (isSuccess) {
				setAlertSuccess(SHIPMENT_ALERT.Success.ShipmentUpdated);
				setSelectedShipment({ mode: null, id: null });
				resetShipmentForm();
				navigate(`..`);
			}
		} catch (error) {
			setAlertError(SHIPMENT_ALERT.Error.ShipmentUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	// const handleSubmit = async () => {
	// 	const isShipmentValid = validateForm(shipment, setError);
	// 	if (mode === OPERATION_MODE.Create) {
	// 		if (!isShipmentValid) return;
	// 		if (isShipmentValid) await createRecord();
	// 	}

	// 	if (mode === OPERATION_MODE.Edit) {
	// 		try {
	// 			if (shallowEqual(shipment, prevShipment)) return setAlertWarning(SHIPMENT_ALERT.Warning.NoChange);
	// 		} catch (error) {
	// 			console.log(error);
	// 		}

	// 		if (!isShipmentValid) return setAlertWarning(SHIPMENT_ALERT.Warning.ShipmentUpdated);

	// 		if (isShipmentValid) await updateRecord();
	// 	}
	// };
	const handleSubmit = async (event) => {
		// Disable the button to prevent multiple submissions
		const button = event.target;
		button.disabled = true;

		const isShipmentValid = validateForm(shipment, setError);
		if (mode === OPERATION_MODE.Create) {
			if (!isShipmentValid) {
				button.disabled = false; // Re-enable the button if validation fails
				return;
			}
			if (isShipmentValid) await createRecord();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(shipment, prevShipment)) {
					button.disabled = false; // Re-enable the button if there's no change
					return setAlertWarning(SHIPMENT_ALERT.Warning.NoChange);
				}
			} catch (error) {
				console.log(error);
				button.disabled = false; // Re-enable the button in case of an error
				return;
			}

			if (!isShipmentValid) {
				button.disabled = false; // Re-enable the button if validation fails
				return setAlertWarning(SHIPMENT_ALERT.Warning.ShipmentUpdated);
			}

			if (isShipmentValid) await updateRecord();
		}
	};

	return (
		<>
			{mode !== null && mode !== OPERATION_MODE.Other && (
				<ShipmentForm handleSubmit={handleSubmit} purchaseOrdersChoices={purchaseOrdersChoices} setPurchaseOrdersChoices={setPurchaseOrdersChoices} />
			)}

			{mode === OPERATION_MODE.Other && (
				<UpdateStatusModel
					openStatusModal={openUpdateStatusModal}
					handleStatusModalClose={handleUpdateModalClose}
					handleStatusChange={handleStatusChange}
					statusloading={statusLoader}
				/>
			)}
		</>
	);
}

Shipment.propTypes = {
	selectedShipment: PropTypes.object,
	setSelectedShipment: PropTypes.func,
	openUpdateStatusModal: PropTypes.bool,
	setOpenUpdateStatusModal: PropTypes.func,
};
