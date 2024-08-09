import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// THIRD-PARTY
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNonPoShipment } from '../../contexts/NonPoShipmentContext';
import NonPOShipmentService from 'services/NonPoShipmentService';
import { OPERATION_MODE } from 'constants/Types';
import { NON_PO_SHIPMENT_ALERT } from 'constants/AlertMessage';
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';
import { isEmpty } from 'validations/validation';
import { shallowEqual } from 'react-redux';
import NonPoShipmentForm from '../forms/NonPoShipmentForm';
import useAuth from 'hooks/useAuth';
//import DeleteModel from 'components/ui/DeleteModel';
import UpdateStatusModel from 'pages/nonPoShipment/components/models/NonPoUpdateStatusModel';
import PurchaseOrderService from 'services/PurchaseOrderService';
import LookupService from 'services/LookupService';

export default function NonPoShipment({ selectedShipment: { mode = null, id = null }, setSelectedShipment, openUpdateStatusModal, setOpenUpdateStatusModal }) {
	const navigate = useNavigate();
	const { userId, companyId } = useAuth();

	const queryClient = useQueryClient();
	const { NonPoshipment, setNonPoShipment, prevNonPoShipment, setPrevNonPoShipment, setError, setMode, loader, setLoader, resetNonPoShipmentForm } = useNonPoShipment();

	const [statusLoader, setStatusLoader] = useState(false);
	const [purchaseOrdersChoices, setPurchaseOrdersChoices] = useState([]);

	const {
		data: { currentShipment },
		isFetching,
	} = useQuery({
		queryKey: ['nonPoshipment', id],
		queryFn: () => getNonShipmentById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentShipment: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit || mode === OPERATION_MODE.Other) ? true : false,
		onError: () => setAlertError(NON_PO_SHIPMENT_ALERT.Error.GetShipment),
	});

	const getNonShipmentById = async () => {
		const { data: { record = {} } = {} } = await NonPOShipmentService.getById(companyId, id);

		console.log(record);

		return { currentShipment: record };
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentShipment]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setNonPoShipment({ ...NonPoshipment, ...currentShipment });
		setPrevNonPoShipment({ ...NonPoshipment, ...currentShipment });
		// setPurchaseOrdersChoices(additionalPoNumbers);
	};

	const validateForm = (NonPoshipment, setError) => {
		const errorList = [];
		const properties = [
			'shipmentReferenceNo',
			'entity',
			'description',
			'natureOfPurchase',
			'typeOfCargo',
			'vendor',
			'buyer',
			'paymentMethod',
			'transportMode',
			'incoTerm',
			'commercialInvoiceNo',
			'currency',
			'shipmentAmount',
			'shipmentType',
			'blawbStatus',
			'blawbNo',
			'eta',
		];

		for (const property of properties) if (isEmpty(NonPoshipment[property])) errorList.push(`validate-${property}`);

		if (!errorList.includes('validate-amount')) {
			const regex = /^\d*\.?\d*$/;

			if (!regex.test(NonPoshipment.amount) && parseFloat(NonPoshipment.amount) < 0) {
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

			const { isSuccess } = await NonPOShipmentService.updateStatus(StatusObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['nonPoshipment'] });
				setAlertSuccess(NON_PO_SHIPMENT_ALERT.Success.NonPoShipmentUpdated);
				setSelectedShipment({ mode: null, id: null });
				resetNonPoShipmentForm();
			}
		} catch (error) {
			setAlertError(NON_PO_SHIPMENT_ALERT.Error.ShipmentUpdated);
		} finally {
			setTimeout(() => setStatusLoader(false), 2200);
		}
	};

	const createRecord = async () => {
		setLoader(true);
		try {
			const NoNshipmentObject = {
				companyId: companyId,
				userId: userId,
				...NonPoshipment,
			};

			const { isSuccess } = await NonPOShipmentService.create(NoNshipmentObject);
			if (isSuccess) {
				setAlertSuccess(NON_PO_SHIPMENT_ALERT.Success.NonPoShipmentCreated);
				resetNonPoShipmentForm();
				navigate(`..`);
			}
		} catch (error) {
			setAlertError(NON_PO_SHIPMENT_ALERT.Error.ShipmentCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateRecord = async () => {
		setLoader(true);
		try {
			const NoNshipmentObject = {
				id: id,
				companyId: companyId,
				userId: userId,
				shipmentReferenceNo: NonPoshipment?.shipmentReferenceNo,
				entity: NonPoshipment?.entity,
				description: NonPoshipment?.description,
				natureOfPurchase: NonPoshipment?.natureOfPurchase,
				typeOfCargo: NonPoshipment?.typeOfCargo,
				vendor: NonPoshipment?.vendor,
				country: NonPoshipment?.country,
				buyer: NonPoshipment?.buyer,
				user: NonPoshipment?.user,
				paymentMethod: NonPoshipment?.paymentMethod,
				transportMode: NonPoshipment?.transportMode,
				incoTerm: NonPoshipment?.incoTerm,
				commercialInvoiceNo: NonPoshipment?.commercialInvoiceNo,
				currency: NonPoshipment?.currency,
				shipmentAmount: NonPoshipment?.shipmentAmount,
				shipmentType: NonPoshipment?.shipmentType,
				blawbStatus: NonPoshipment?.blawbStatus,
				blawbNo: NonPoshipment?.blawbNo,
				eta: NonPoshipment?.eta,

				supportGRN: NonPoshipment?.supportGRN,
				grn: NonPoshipment?.grn,
				grnDate: NonPoshipment?.grnDate,
				grnRejectedReason: NonPoshipment?.grnRejectedReason,
				insurancePolicyNumbers: NonPoshipment?.insurancePolicyNumbers,
				grnClaimableAmount: NonPoshipment?.grnClaimableAmount,
				grnClaimedAmount: NonPoshipment?.grnClaimedAmount,

				supportLicense: NonPoshipment?.supportLicense,
				license: NonPoshipment?.license,
				approval: NonPoshipment?.approval,
				approvalDate: NonPoshipment?.approvalDate,
				approvalReference: NonPoshipment?.approvalReference,
				approvalExpiry: NonPoshipment?.approvalExpiry,

				supportDemurrage: NonPoshipment?.supportDemurrage,
				demurrage: NonPoshipment?.demurrage,
				demurrageAmount: [NonPoshipment?.demurrageAmount],
				demurrageReason: NonPoshipment?.demurrageReason,
				demurrageClaimableAmount: NonPoshipment?.demurrageClaimableAmount,
				demurrageClaimedAmount: NonPoshipment?.demurrageClaimedAmount,

				supportContainerDeposit: NonPoshipment?.supportContainerDeposit,
				containerDeposit: NonPoshipment?.containerDeposit,
				containerNumbers: NonPoshipment?.containerNumbers,
				depositedAmount: NonPoshipment?.depositedAmount,
				acknowledgeInvoiceReceivedDate: NonPoshipment?.acknowledgeInvoiceReceivedDate,
				refundedAmount: NonPoshipment?.refundedAmount,
				deductedAmount: NonPoshipment?.deductedAmount,
				chequeNo: NonPoshipment?.chequeNo,
				chequeReceivedDate: NonPoshipment?.chequeReceivedDate,
				chequeDepositedDate: NonPoshipment?.chequeDepositedDate,
				acknowledgeDateToFinance: NonPoshipment?.acknowledgeDateToFinance,
				cdRemarks: NonPoshipment?.cdRemarks,

				poNumber: NonPoshipment?.poNumber,
				additionalPONumber: NonPoshipment?.additionalPONumber,
				volume: NonPoshipment?.volume,
				quantity: NonPoshipment?.quantity,
				vessel: NonPoshipment?.vessel,
				shippingLine: NonPoshipment?.shippingLine,
				portOfLoad: NonPoshipment?.portOfLoad,
				portOfDischarge: NonPoshipment?.portOfDischarge,
				mawb: NonPoshipment?.mawb,
				etd: NonPoshipment?.etd,
				revisedEta: NonPoshipment?.revisedEta,
				clearingAgent: NonPoshipment?.clearingAgent,
				docReceivedDate: NonPoshipment?.docReceivedDate,
				documentsToCHA: NonPoshipment?.documentsToCHA,
				cusdecNo: NonPoshipment?.cusdecNo,
				cusdecDate: NonPoshipment?.cusdecDate,
				cargoClearedDate: NonPoshipment?.cargoClearedDate,
				remarks: NonPoshipment?.remarks,
			};
			console.log(NonPoshipment);

			const { isSuccess } = await NonPOShipmentService.update(NoNshipmentObject);

			if (isSuccess) {
				setAlertSuccess(NON_PO_SHIPMENT_ALERT.Success.NonPoShipmentUpdated);
				setSelectedShipment({ mode: null, id: null });
				resetNonPoShipmentForm();
				navigate(`..`);
			}
		} catch (error) {
			setAlertError(NON_PO_SHIPMENT_ALERT.Error.ShipmentUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleSubmit = async (event) => {
		// Disable the button to prevent multiple submissions
		const button = event.target;
		button.disabled = true;

		const isShipmentValid = validateForm(NonPoshipment, setError);
		if (mode === OPERATION_MODE.Create) {
			if (!isShipmentValid) {
				button.disabled = false; // Re-enable the button if validation fails
				return;
			}
			if (isShipmentValid) await createRecord();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(NonPoshipment, prevNonPoShipment)) {
					button.disabled = false; // Re-enable the button if there's no change
					return setAlertWarning(NON_PO_SHIPMENT_ALERT.Warning.NoChange);
				}
			} catch (error) {
				console.log(error);
				button.disabled = false; // Re-enable the button in case of an error
				return;
			}

			if (!isShipmentValid) {
				button.disabled = false; // Re-enable the button if validation fails
				return setAlertWarning(NON_PO_SHIPMENT_ALERT.Warning.ShipmentUpdated);
			}

			if (isShipmentValid) await updateRecord();
		}
	};

	return (
		<>
			{mode !== null && mode !== OPERATION_MODE.Other && (
				<NonPoShipmentForm handleSubmit={handleSubmit} purchaseOrdersChoices={purchaseOrdersChoices} setPurchaseOrdersChoices={setPurchaseOrdersChoices} />
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

NonPoShipment.propTypes = {
	selectedShipment: PropTypes.object,
	setSelectedShipment: PropTypes.func,
	openUpdateStatusModal: PropTypes.bool,
	setOpenUpdateStatusModal: PropTypes.func,
};
