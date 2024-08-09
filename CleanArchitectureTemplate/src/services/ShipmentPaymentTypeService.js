import axios from '../lib/axios-config';

const getAll = (companyId, page, limit) => {
	//return axios.get(`/Companies?page=${page}&limit=${limit}`);
	return axios.get(`/ShipmentPaymentTypes/${companyId}?page=${page}&limit=${limit}`);
};

const getById = (companyId, id) => {
	return axios.get(`/ShipmentPaymentTypes/${companyId}/${id}`);
};

const create = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.post('ShipmentPaymentTypes', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const update = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.put('ShipmentPaymentTypes', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const remove = async (data) => {
	const initialResponse = { isSuccess: false };
	console.log(data);

	try {
		const { data: apiResponse = {} } = await axios.delete('ShipmentPaymentTypes', { data });

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const ShipmentPaymentTypeService = {
	getAll,
	getById,
	create,
	update,
	remove,
};

export default ShipmentPaymentTypeService;
