import axios from '../lib/axios-config';

const getAll = (companyId, purchaseNo, startDate, endDate, page, limit, searchVisible) => {
	if (searchVisible && (purchaseNo || startDate || endDate))
		return axios.get(`/purchaseOrders/${companyId}?searchTerm=${purchaseNo}&startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`);

	return axios.get(`/purchaseOrders/${companyId}?page=${page}&limit=${limit}`);
};

const getById = (companyId, id) => {
	return axios.get(`/purchaseOrders/${companyId}/${id}`);
};

const createNos = async (data) => {
	return axios.post('purchaseOrders/Nos', data);
};

const create = async (data) => {
	const initialResponse = { isSuccess: false };
	console.log(data);

	try {
		const { data: apiResponse = {} } = await axios.post('purchaseOrders', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const createPoNo = async (data) => {
	const initialResponse = { isSuccess: false };
	console.log(data);

	try {
		const { data: apiResponse = {} } = await axios.post('purchaseOrders/Nos', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const createBulk = async (CompanyId, UserId, Entity, NatureOfPurchase, Buyer, User, PaymentMethod, formData) => {
	const initialResponse = { isSuccess: false, errors: [] };

	try {
		const { data: apiResponse = {} } = await axios.post(
			`PurchaseOrders/Bulk?CompanyId=${CompanyId}&UserId=${UserId}&Entity=${Entity}&NatureOfPurchase=${NatureOfPurchase}&Buyer=${Buyer}&User=${User}&PaymentMethod=${PaymentMethod}`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);
		console.log('apiResponse', apiResponse);
		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const update = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.put('purchaseOrders', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const isExists = (companyId, poNo) => {
	return axios.get(`/purchaseOrders/${companyId}/${poNo}/IsExists`);
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

const PurchaseOrderService = {
	getAll,
	getById,
	create,
	update,
	createPoNo,
	createNos,
	createBulk,
	isExists,
};

export default PurchaseOrderService;
