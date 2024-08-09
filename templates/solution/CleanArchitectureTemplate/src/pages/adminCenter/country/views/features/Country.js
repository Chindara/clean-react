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
import CountryForm from '../forms/CountryForm';

// CONTEXTS
import { useCountry } from 'pages/adminCenter/country/contexts/CountryContext';

// SERVICES
import CountryService from 'services/CountryService';

// VALIDATIONS
import { isEmpty } from 'validations/validation';

// ALERTS
import { setAlertError, setAlertSuccess, setAlertWarning } from 'components/alert/Alert';

// CONSTANTS
import { COUNTRY_ALERT } from 'constants/AlertMessage';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| COUNTRY ||============================== //

export default function Country({ openPanel, setOpenPanel, openDeleteModal, setOpenDeleteModal, selectedCountry: { mode = null, id = null }, setSelectedCountry }) {
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const { country, setCountry, setError, loader, setLoader, setMode, prevCountry, setPrevCountry, resetCountryForm } = useCountry();

	const [openExitModal, setOpenExitModal] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	const {
		data: { currentCountry },
		isFetching,
	} = useQuery({
		queryKey: ['country', id],
		queryFn: () => getCountryById(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { currentCountry: {} },
		enabled: id && (mode === OPERATION_MODE.View || mode === OPERATION_MODE.Edit) ? true : false,
		onError: () => setAlertError(COUNTRY_ALERT.Error.GetCountry),
	});

	const getCountryById = async () => {
		const { data: { record = {} } = {} } = await CountryService.getById(companyId, id);
		return { currentCountry: record };
	};

	const validateCountryForm = (country, setError) => {
		const errorList = [];
		const properties = ['name'];

		for (const property of properties) if (isEmpty(country[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [mode, currentCountry]);

	const initStateSetter = () => {
		setMode(mode);
		if (mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Delete) return;

		setCountry({ ...country, ...currentCountry });
		setPrevCountry({ ...country, ...currentCountry });
	};

	const handlePanelClose = () => {
		setOpenPanel(false);
		setSelectedCountry({ mode: null, id: null });
		resetCountryForm();
	};

	const handleDeleteModalClose = () => {
		setOpenDeleteModal(false);
	};

	const handleExitModal = (mode) => {
		setOpenExitModal(!openExitModal);
		if (mode === 'Yes') {
			setOpenPanel(false);
			setSelectedCountry({ mode: null, id: null });
			resetCountryForm();
		}
	};

	const createCountry = async () => {
		setLoader(true);

		try {
			const countryObject = { companyId: companyId, userId: userId, ...country };
			console.log(countryObject);

			const { isSuccess } = await CountryService.create(countryObject);

			if (isSuccess) {
				setAlertSuccess(COUNTRY_ALERT.Success.CountryCreated);
				queryClient.invalidateQueries({ queryKey: ['country'] });
				setOpenPanel(false);
				resetCountryForm();
			}
		} catch (error) {
			setAlertError(COUNTRY_ALERT.Error.CountryCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const updateCountry = async () => {
		setLoader(true);
		try {
			const { id, name, status } = country;
			const countryObject = { id, name, status, userId };
			const { isSuccess } = await CountryService.update(countryObject);

			if (isSuccess) {
				setAlertSuccess(COUNTRY_ALERT.Success.CountryUpdated);
				setOpenPanel(false);
				queryClient.invalidateQueries({ queryKey: ['country'] });
				setSelectedCountry({ mode: null, id: null });
				resetCountryForm();
			}
		} catch (error) {
			setAlertError(COUNTRY_ALERT.Error.CountryUpdated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

	const handleDeleteCountry = async () => {
		setDeleteLoader(true);

		try {
			const countryObject = { id, userId };
			console.log(countryObject);

			const { isSuccess } = await CountryService.remove(countryObject);

			if (isSuccess) {
				queryClient.invalidateQueries({ queryKey: ['country'] });
				setAlertSuccess(COUNTRY_ALERT.Success.CountryDeleted);
				setOpenPanel(false);
			}
			setOpenDeleteModal(false);
		} catch (error) {
			setAlertError(COUNTRY_ALERT.Error.CountryDeleted);
		} finally {
			setDeleteLoader(false);
		}
	};

	const handleSubmit = async () => {
		const isCountryValid = validateCountryForm(country, setError);

		if (mode === OPERATION_MODE.Create) {
			if (!isCountryValid) return;

			if (isCountryValid) await createCountry();
		}

		if (mode === OPERATION_MODE.Edit) {
			try {
				if (shallowEqual(country, prevCountry)) return setAlertWarning(COUNTRY_ALERT.Warning.NoChange);
			} catch (error) {
				console.log(error);
			}

			if (!isCountryValid) return setAlertWarning(COUNTRY_ALERT.Warning.CountryUpdated);

			if (isCountryValid) await updateCountry();
		}
	};

	return (
		<>
			<Panel
				panel={{ openPanel: openPanel, expand: false }}
				panelHeader={{ title: mode === OPERATION_MODE.Create ? 'Create Country' : mode === OPERATION_MODE.Edit ? 'Edit Country' : 'View Country', titleCloseButton: false }}
				panelContent={{
					content: <CountryForm isFetching={isFetching} />,
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

			<DeleteModel openModal={openDeleteModal} handleModalClose={handleDeleteModalClose} handleDelete={handleDeleteCountry} loading={deleteLoader} />
		</>
	);
}

Country.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedCountry: PropTypes.object,
	setSelectedCountry: PropTypes.func,
};
