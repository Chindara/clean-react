import React, { useEffect } from 'react';
import useAuth from 'hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { changeOfficerView, setCompanyName } from 'store/reducers/menu';
import { dispatch } from 'store';
import CompanyService from 'services/CompanyService';
import { setAlertError } from 'components/alert/Alert';
import { COMPANY_ALERT } from 'constants/AlertMessage';

export default function DashboardFeature() {
	const { companyId } = useAuth();

	const {
		data: { company },
	} = useQuery({
		queryKey: ['company'],
		queryFn: () => getUserCompany(),
		refetchOnWindowFocus: false,
		initialData: { company: {} },
		onError: () => setAlertError(COMPANY_ALERT.Error.GetCompany),
	});

	const getUserCompany = async () => {
		const { data: { record } = {} } = await CompanyService.getById(companyId);

		return { company: record };
	};

	useEffect(() => {
		dispatch(changeOfficerView({ officerView: false }));
		dispatch(setCompanyName({ companyName: company?.name }));
	}, [company]);

	return <h1>{company?.name}</h1>;
}
