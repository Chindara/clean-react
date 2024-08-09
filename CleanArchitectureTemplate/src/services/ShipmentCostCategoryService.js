import axios from '../lib/axios-config';

const getAll = (companyId, page, size) => {
	return axios.get(`/ShipmentCategory/${companyId}?page=${page}&size=${size}`);
};

const getById = (companyId, id) => {
	return axios.get(`/ShipmentCategory/${companyId}/${id}`);
};

const create = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.post('ShipmentCategory', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const update = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.put('ShipmentCategory', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const remove = async (data) => {
	const initialResponse = { isSuccess: false };
	console.log(data);

	try {
		const { data: apiResponse = {} } = await axios.delete('ShipmentCategory', { data });

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const ShipmentCostCategoryService = {
	getAll,
	getById,
	create,
	update,
	remove,
};

export default ShipmentCostCategoryService;
