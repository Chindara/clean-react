import axios from '../lib/axios-config';

const getAll = (companyId, page, limit) => {
	//return axios.get(`/Companies?page=${page}&limit=${limit}`);
	return axios.get(`/paymentmethods/${companyId}?page=${page}&limit=${limit}`);
};

const getById = (companyId, id) => {
	return axios.get(`/paymentmethods/${companyId}/${id}`);
};

const create = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.post('paymentmethods', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const update = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.put('paymentmethods', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const remove = async (data) => {
	const initialResponse = { isSuccess: false };
	console.log(data);

	try {
		const { data: apiResponse = {} } = await axios.delete('paymentmethods', { data });

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const PaymentService = {
	getAll,
	getById,
	create,
	update,
	remove,
};

export default PaymentService;
