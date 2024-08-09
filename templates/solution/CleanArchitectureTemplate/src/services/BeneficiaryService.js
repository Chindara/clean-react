import axios from '../lib/axios-config';

const getAll = (companyId, page, size) => {
	return axios.get(`/beneficiaries/${companyId}?page=${page}&size=${size}`);
};

const getById = (companyId, id) => {
	return axios.get(`/beneficiaries/${companyId}/${id}`);
};

const create = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.post('beneficiaries', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const update = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.put('beneficiaries', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const remove = async (data) => {
	const initialResponse = { isSuccess: false };
	console.log(data);

	try {
		const { data: apiResponse = {} } = await axios.delete('beneficiaries', { data });

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const BeneficiaryService = {
	getAll,
	getById,
	create,
	update,
	remove,
};

export default BeneficiaryService;