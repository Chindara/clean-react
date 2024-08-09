import axios from '../lib/axios-config';

const getAll = (companyId, page, limit) => {
	//return axios.get(`/Companies?page=${page}&limit=${limit}`);
	return axios.get(`/NatureOfPurchases/${companyId}?page=${page}&limit=${limit}`);
};

const getById = (companyId, id) => {
	return axios.get(`/natureOfPurchases/${companyId}/${id}`);
};

const create = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.post('natureOfPurchases', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const update = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.put('natureOfPurchases', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const remove = async (data) => {
	const initialResponse = { isSuccess: false };
	console.log(data);

	try {
		const { data: apiResponse = {} } = await axios.delete('natureOfPurchases', { data });

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const natureOfPurchaseService = {
	getAll,
	getById,
	create,
	update,
	remove,
};

export default natureOfPurchaseService;
