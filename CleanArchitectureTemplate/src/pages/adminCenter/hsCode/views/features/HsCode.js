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
import HsCodeForm from '../forms/HsCodeForm';

// CONTEXTS
import { useHsCode } from 'pages/adminCenter/hsCode/contexts/HsCodeContext';

// SERVICES
import HsCodeService from 'services/HsCodeService';

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { HS_CODE_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| HS CODE ||============================== //

export default function HsCode({ openPanel, setOpenPanel, openDeleteModal, setOpenDeleteModal, selectedHsCode: { mode = null, id = null }, setSelectedHsCode }) {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const { hsCode, setHsCode, setError, loader, setLoader, setMode, prevHsCode, setPrevHsCode, resetHsCodeForm } = useHsCode();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentHsCode },
		isFetching,
	} = useQuery({
		queryKey: ['hsCode', id],
		queryFn: () => getHsCodeById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentHsCode: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(HS_CODE_ALERT.Error.GetHsCode),
	});

	const getHsCodeById = async () => {
		const { data: { record = {} } = {} } = await HsCodeService.getById(companyId, id);
		console.log(record);
		return { currentHsCode: record };
	};

	const validateHsCodeForm = (hsCode, setError) => {
		const errorList = [];
		const properties = ['code', 'description'];

		for (const property of properties) if (isEmpty(hsCode[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentHsCode]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setHsCode({ ...hsCode, ...currentHsCode });
		setPrevHsCode({ ...hsCode, ...currentHsCode });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedHsCode({ mode: null, id: null });
		resetHsCodeForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedHsCode({ mode: null, id: null });
			resetHsCodeForm();
		}
	};

	const createHsCode = async () => {
		setLoader(true);

		try {
			const hsCodeObject = { companyId: companyId, userId: userId, ...hsCode };
			console.log(hsCodeObject);

			const { isSuccess } = await HsCodeService.create(hsCodeObject);

			if (isSuccess) {
				setAlertSuccess(HS_CODE_ALERT.Success.HsCodeCreated);
				queryClient.invalidateQueries({ queryKey: ['hsCode'] });
				setOpenPanel(false);
				resetHsCodeForm();
			}
		} catch (error) {
			setAlertError(HS_CODE_ALERT.Error.HsCodeCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateHsCode = async () => {
		setLoader(true);
		try {
			const {
				id,
				name,
				status,
				code,
				description,
				unit,
				iclslsi,
				preferentialAP,
				preferentialAD,
				preferentialBN,
				preferentialGT,
				preferentialIN,
				preferentialPK,
				preferentialSA,
				preferentialSF,
				preferentialSD,
				preferentialSG,
				genDuty,
				vat,
				palGen,
				palsg,
				cessGen,
				cessSG,
				surchargeOnCustomsDuty,
				excise,
				sscl,
				scl,
			} = hsCode;

			console.log(hsCode);

			const hsCodeObject = {
				// id : id,
				// companyId: companyId,
				// userId: userId,
				// status,
				// code: hsCode?.code,
				// description: hsCode?.description,
				// unit: hsCode?.unit,
				// iclslsi: hsCode?.iclslsi,
				// preferentialAP: hsCode?.preferentialAP,
				// preferentialAD: hsCode?.preferentialAD,
				// preferentialBN: hsCode?.preferentialBN,
				// preferentialGT: hsCode?.preferentialGT,
				// preferentialIN: hsCode?.preferentialIN,
				// preferentialPK: hsCode?.preferentialPK,
				// preferentialSA: hsCode?.preferentialSA,
				// preferentialSF: hsCode?.preferentialSF,
				// preferentialSD: hsCode?.preferentialSD,
				// preferentialSG: hsCode?.preferentialSG,
				// genDuty:hsCode?.genDuty,
				// vat: hsCode?.vat,
				// palGen: hsCode?.palGen,
				// palsg: hsCode?.palsg,
				// cessGen:hsCode?.cessGen,
				// cessSG: hsCode?.cessSG,
				// surchargeOnCustomsDuty: hsCode?.surchargeOnCustomsDuty,
				// excise: hsCode?.excise,
				// sscl: hsCode?.sscl,
				// scl:hsCode?.scl,
				id,
				companyId,
				userId,
				status,
				code,
				description,
				unit,
				iclslsi,
				preferentialAP,
				preferentialAD,
				preferentialBN,
				preferentialGT,
				preferentialIN,
				preferentialPK,
				preferentialSA,
				preferentialSF,
				preferentialSD,
				preferentialSG,
				genDuty,
				vat,
				palGen,
				palsg,
				cessGen,
				cessSG,
				surchargeOnCustomsDuty,
				excise,
				sscl,
				scl,
			};
			console.log(hsCodeObject);

			const { isSuccess } = await HsCodeService.update(hsCodeObject);

			if (isSuccess) {
				setAlertSuccess(HS_CODE_ALERT.Success.HsCodeUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['hsCode'] });
				setSelectedHsCode({ mode: null, id: null });
				resetHsCodeForm();
			}
		} catch (error) {
			setAlertError(HS_CODE_ALERT.Error.HsCodeUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeleteHsCode = async () => {
		setDeleteLoader(true);

		try {
			const hsCodeObject = { id, userId };
			console.log(hsCodeObject);

			const { isSuccess } = await HsCodeService.remove(hsCodeObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['hsCode'] });
				setAlertSuccess(HS_CODE_ALERT.Success.HsCodeDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(HS_CODE_ALERT.Error.HsCodeDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		const isHsCodeValid = validateHsCodeForm(hsCode, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isHsCodeValid) return;

			if (isHsCodeValid) await createHsCode();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(hsCode, prevHsCode)) return setAlertWarning(HS_CODE_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isHsCodeValid) return setAlertWarning(HS_CODE_ALERT.Warning.HsCodeUpdated);

			if (isHsCodeValid) await updateHsCode();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: true }}
				panelHeader={{ title: mode === OPERATION_MODE.Create ? 'Create HsCode' : mode === OPERATION_MODE.Edit ? 'Edit HsCode' : 'View HsCode', titleCloseButton: false }}
				panelContent={{
					content: <HsCodeForm isFetching={isFetching} />,
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

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={handleDeleteHsCode} loading={deleteLoader} />
		</>
	);
}

HsCode.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedHsCode: PropTypes.object,
	setSelectedHsCode: PropTypes.func,
};
