import axios from '../lib/axios-config';

const getAll = (companyId, ShipmentId) => {
	return axios.get(`/ShipmentLogisticInvoices/${companyId}/Shipment/${ShipmentId}`);
};

const getAllLogisNonPO = (CompanyId, ShipmentId) => {
	return axios.get(`/ShipmentLogisticInvoices/${CompanyId}/NonPoShipment/${ShipmentId}`);
};

const getById = (CompanyId, InvoiceId) => {
	return axios.get(`/ShipmentLogisticInvoices/${CompanyId}/LogisticInvoice/${InvoiceId}`);
};

const create = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.post('/ShipmentLogisticInvoices', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		console.log(error);
		return initialResponse;
	}
};

const update = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.put('/ShipmentLogisticInvoices', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const remove = async (data) => {
	const initialResponse = { isSuccess: false };
	console.log(data);

	try {
		const { data: apiResponse = {} } = await axios.delete('/ShipmentLogisticInvoices', { data });

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const ShipmentLogisticsInvoiceService = {
	getAll,
	getAllLogisNonPO,
	getById,
	create,
	update,
	remove,
};

export default ShipmentLogisticsInvoiceService;
