import axios from '../lib/axios-config';

const getAll = (companyId, PurchaseId, page, limit, searchVisible) => {
	if (searchVisible && PurchaseId !== 0) return axios.get(`/shipments/${companyId}?PurchaseId=${PurchaseId}&page=${page}&limit=${limit}`);
	else return axios.get(`/shipments/${companyId}?PurchaseId=0&page=${page}&limit=${limit}`);
};

const getById = (companyId, id) => {
	return axios.get(`/shipments/${companyId}/${id}`);
};

const create = async (data) => {
	const initialResponse = { isSuccess: false };
	console.log(data);

	try {
		const { data: apiResponse = {} } = await axios.post('/shipments', data);
		console.log(data);
		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const update = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.put('/shipments', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const updateStatus = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.put('/shipments/ChangeStatus', data);

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

const ShipmentService = {
	getAll,
	getById,
	create,
	update,
	updateStatus,
};

export default ShipmentService;
