import axios from '../lib/axios-config';

const getAll = (companyId, page, size) => {
	return axios.get(`/ClearingAgent/${companyId}?page=${page}&size=${size}`);
};

const getById = (companyId, id) => {
	return axios.get(`/ClearingAgent/${companyId}/${id}`);
};

const create = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.post('ClearingAgent', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const update = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.put('ClearingAgent', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const remove = async (data) => {
	const initialResponse = { isSuccess: false };
	console.log(data);

	try {
		const { data: apiResponse = {} } = await axios.delete('ClearingAgent', { data });

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const ClearingAgentService = {
	getAll,
	getById,
	create,
	update,
	remove,
};

export default ClearingAgentService;
