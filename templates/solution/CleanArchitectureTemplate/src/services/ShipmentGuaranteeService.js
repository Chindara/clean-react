import axios from '../lib/axios-config';

const getAll = (CompanyId, ShipmentId) => {
	return axios.get(`/ShipmentGuarantees/${CompanyId}/Shipment/${ShipmentId}/Guarantors`);
};

const getAllGuarantNonPO = (CompanyId, ShipmentId) => {
	return axios.get(`/ShipmentGuarantees/${CompanyId}/NonPoShipment/${ShipmentId}`);
};

const getById = (companyId, guarantorId) => {
	return axios.get(`/ShipmentGuarantees/${companyId}/Guarantor/${guarantorId}`);
};

const create = async (data) => {
	console.log(data);
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.post('/ShipmentGuarantees', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const update = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.put('/ShipmentGuarantees', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const remove = async (data) => {
	const initialResponse = { isSuccess: false };
	console.log(data);

	try {
		const { data: apiResponse = {} } = await axios.delete('/ShipmentGuarantees', { data });

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const GuaranteeService = {
	getAll,
	getAllGuarantNonPO,
	getById,
	create,
	update,
	remove,
};

export default GuaranteeService;
