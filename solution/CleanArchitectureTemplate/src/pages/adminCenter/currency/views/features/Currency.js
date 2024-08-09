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
import CurrencyForm from '../forms/CurrencyForm';

// CONTEXTS
import { useCurrency } from 'pages/adminCenter/currency/contexts/CurrencyContext';

// SERVICES
import CurrencyService from 'services/CurrencyService';

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { CURRENCY_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';
import LookupService from 'services/LookupService';

// ==============================|| CURRENCY ||============================== //

export default function Currency({ openPanel, setOpenPanel, openDeleteModal, setOpenDeleteModal, selectedCurrency: { mode = null, id = null }, setSelectedCurrency }) {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const { currency, setCurrency, setError, loader, setLoader, setMode, prevCurrency, setPrevCurrency, resetCurrencyForm } = useCurrency();
	const [purchaseNos, setPurchaseNos] = useState([]);
	
	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentCurrency },
		isFetching,
	} = useQuery({
		queryKey: ['currency', id],
		queryFn: () => getCurrencyById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentCurrency: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(CURRENCY_ALERT.Error.GetCurrency),
	});

	useEffect(() => {
		(async () => {
			try {
				const { data = [] } = await LookupService.getCurrencies(companyId);
				const poNumberChoices = data.reduce((accumulator, object) => [...accumulator, { label: object.name, value: object.id }], []);

				setPurchaseNos(poNumberChoices);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	const getCurrencyById = async () => {
		const { data: { record = {} } = {} } = await CurrencyService.getById(companyId, id);
		console.log(record);
		return { currentCurrency: record };
	};

	const validateCurrencyForm = (currency, setError) => {
		const errorList = [];
		const properties = ['name'];

		for (const property of properties) if (isEmpty(currency[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentCurrency]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setCurrency({ ...currency, ...currentCurrency });
		setPrevCurrency({ ...currency, ...currentCurrency });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedCurrency({ mode: null, id: null });
		resetCurrencyForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedCurrency({ mode: null, id: null });
			resetCurrencyForm();
		}
	};

	const createCurrency = async () => {
		setLoader(true);

		try {
			const currencyObject = { companyId: companyId, userId: userId, ...currency };
			console.log(currencyObject);

			const { isSuccess } = await CurrencyService.create(currencyObject);

			if (isSuccess) {
				setAlertSuccess(CURRENCY_ALERT.Success.CurrencyCreated);
				queryClient.invalidateQueries({ queryKey: ['currency'] });
				setOpenPanel(false);
				resetCurrencyForm();
			}
		} catch (error) {
			setAlertError(CURRENCY_ALERT.Error.CurrencyCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateCurrency = async () => {
		setLoader(true);
		try {
			const { id, name, status } = currency;

			const currencyObject = { id, name, status, userId };
			console.log(currencyObject);

			const { isSuccess } = await CurrencyService.update(currencyObject);

			if (isSuccess) {
				setAlertSuccess(CURRENCY_ALERT.Success.CurrencyUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['currency'] });
				setSelectedCurrency({ mode: null, id: null });
				resetCurrencyForm();
			}
		} catch (error) {
			setAlertError(CURRENCY_ALERT.Error.CurrencyUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeleteCurrency = async () => {
		setDeleteLoader(true);

		try {
			const currencyObject = { id, userId };
			console.log(currencyObject);

			const { isSuccess } = await CurrencyService.remove(currencyObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['currency'] });
				setAlertSuccess(CURRENCY_ALERT.Success.CurrencyDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(CURRENCY_ALERT.Error.CurrencyDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		const isCurrencyValid = validateCurrencyForm(currency, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isCurrencyValid) return;

			if (isCurrencyValid) await createCurrency();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(currency, prevCurrency)) return setAlertWarning(CURRENCY_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isCurrencyValid) return setAlertWarning(CURRENCY_ALERT.Warning.CurrencyUpdated);

			if (isCurrencyValid) await updateCurrency();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{ title: mode === OPERATION_MODE.Create? 'Create Currency'
				: mode === OPERATION_MODE.Edit? 'Edit Currency'
				: 'View Currency',
			titleCloseButton: false}}
				panelContent={{
					content: <CurrencyForm isFetching={isFetching} />,
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

Currency.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedCurrency: PropTypes.object,
	setSelectedCurrency: PropTypes.func,
};
