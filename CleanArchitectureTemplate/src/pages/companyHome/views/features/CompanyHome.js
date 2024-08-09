import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { useCompanyHome } from 'pages/companyHome/contexts/CompanyHomeContext';
import { isEmpty } from 'validations/validation';
import { setAlertError, setAlertSuccess } from 'components/alert/Alert';
import { COMPANY_HOME_ALERT } from 'constants/AlertMessage';
import CompanyHomeService from 'services/CompanyHomeService';
import CompanyHomeList from '../lists/CompanyHomeList';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function CompanyHome() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { purchaseOrderId } = useParams();
	const { userId, companyId } = useAuth();
	const {
		companyHome,
		setCompanyHome,
		companyHomes,
		setCompanyHomes,
		setError,
		loader,
		setLoader,
		resetCompanyHomeList,
	} = useCompanyHome();

	const {
		data: { currentCompanyHomes },
		isFetching,
	} = useQuery({
		queryKey: ['companyHome', purchaseOrderId],
		queryFn: () => getCompanyHomes(),
		refetchOnWindowFocus: false,
		initialData: { currentCompanyHomes: [] },
	});

	const getCompanyHomes = async () => {
		const response = await CompanyHomeService.getAll(companyId, purchaseOrderId);
		return { currentCompanyHomes: response.data };
	};

	const validateForm = (companyHome, setError) => {
		const errorList = [];
		const properties = ['comment'];

		for (const property of properties)
			if (isEmpty(companyHome[property])) errorList.push(`validate-${property}`);

		if (errorList.length) {
			setError(errorList);
			return false;
		}

		return true;
	};

	useEffect(() => {
		initStateSetter();
	}, [isFetching]);

	const initStateSetter = () => {
		setCompanyHomes(currentCompanyHomes);
	};

	const createRecord = async () => {
		setLoader(true);

		try {
			const currencyObject = {
				companyId: companyId,
				userId: userId,
				...companyHome,
				poId: purchaseOrderId,
			};

			const { isSuccess } = await CompanyHomeService.create(currencyObject);

			if (isSuccess) {
				setAlertSuccess(COMPANY_HOME_ALERT.Success.CompanyHomeCreated);
				queryClient.invalidateQueries({ queryKey: ['companyHome'] });
			}
		} catch (error) {
			setAlertError(COMPANY_HOME_ALERT.Error.CompanyHomeCreated);
		} finally {
			setTimeout(() => setLoader(false), 2200);
		}
	};

}
