import axios from '../lib/axios-config';

const getById = (companyId, poId) => {
	return axios.get(`PurchaseOrderBank/${companyId}/${poId}`);
};

const getLookupBanks = (companyId) => {
	return axios.get(`v1/Lookups/Bank/${companyId}`);
};

const createPurchaseOrderBank = async (paymentMethod, data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.post(`PurchaseOrderBank/${paymentMethod}`, data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const updatePurchaseOrderBank = async (paymentMethod, data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.put(`PurchaseOrderBank/${paymentMethod}`, data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const PurchaseOrderBankService = {
	getById,
	getLookupBanks,
	createPurchaseOrderBank,
	updatePurchaseOrderBank,
};

export default PurchaseOrderBankService;
