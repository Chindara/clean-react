import axios from '../lib/axios-config';

const getAll = (companyId, poId) => {
	return axios.get(`${companyId}/purchaseOrders/${poId}/track`);
};

const create = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.post('track', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const PurchaseOrderHistoryService = {
	getAll,
	create,
};

export default PurchaseOrderHistoryService;
