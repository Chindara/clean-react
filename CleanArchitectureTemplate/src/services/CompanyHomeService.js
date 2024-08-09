import axios from '../lib/axios-config';

const getAll = (companyId, page, limit) => {
	return axios.get(`/Companies?page=${page}&limit=${limit}`);
};

const getById = (companyId, id) => {
	return axios.get(`/companyHomes/${companyId}/${id}`);
};

const create = async (data) => {
	const initialResponse = { isSuccess: false };
	console.log(data);

	try {
		const { data: apiResponse = {} } = await axios.post('companyHomes/CompanyHome', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const update = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.put('companyhomes', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const remove = async (data) => {
	const initialResponse = { isSuccess: false };
	console.log(data);

	try {
		const { data: apiResponse = {} } = await axios.delete('companyHomes', { data });

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const CompanyHomeService = {
	getAll,
	getById,
	create,
};

export default CompanyHomeService;
