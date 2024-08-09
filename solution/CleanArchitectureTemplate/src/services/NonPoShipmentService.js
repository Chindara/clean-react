import axios from '../lib/axios-config';

const getAll = (companyId, page, limit) => {
	return axios.get(`/NonPOShipmentS/${companyId}?page=${page}&limit=${limit}`);
};

const getById = (companyId, id) => {
	return axios.get(`/NonPOShipmentS/${companyId}/${id}`);
};

const getNonPoById = (companyId, id) => {
	return axios.get(`/NonPOShipments/${companyId}/${id}`);
};

const create = async (data) => {
	const initialResponse = { isSuccess: false };
	console.log(data);

	try {
		const { data: apiResponse = {} } = await axios.post('/NonPOShipmentS', data);
		console.log(data);
		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const update = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.put('/NonPOShipmentS', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const updateStatus = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.put('/NonPOShipments/ChangeStatus', data);
		console.log(data);
		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

// const remove = async (data) => {
// 	const initialResponse = { isSuccess: false };
// 	console.log(data);

// 	try {
// 		const { data: apiResponse = {} } = await axios.delete('currencies', { data });

// 		return { ...initialResponse, ...apiResponse };
// 	} catch (error) {
// 		return initialResponse;
// 	}
// };

const NonPOShipmentService = {
	getAll,
	getNonPoById,
	getById,
	create,
	update,
	updateStatus,
};

export default NonPOShipmentService;
