import axios from '../lib/axios-config';

const getAll = (CompanyId, ShipmentId) => {
	return axios.get(`/ShipmentDuties/${CompanyId}/Shipment/${ShipmentId}/Duties`);
};

const getAllNonPO = (CompanyId, ShipmentId) => {
	return axios.get(`/ShipmentDuties/${CompanyId}/NonPoShipment/${ShipmentId}`);
};

const getById = (CompanyId, DutyId) => {
	return axios.get(`/ShipmentDuties/${CompanyId}/Duty/${DutyId}`);
};

const create = async (data) => {
	console.log(data);
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.post('/ShipmentDuties', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const update = async (data) => {
	console.log(data);
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.put('/ShipmentDuties', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const remove = async (data) => {
	const initialResponse = { isSuccess: false };
	console.log(data);

	try {
		const { data: apiResponse = {} } = await axios.delete('/ShipmentDuties', { data });

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const ShipmentDutyService = {
	getAll,
	getAllNonPO,
	getById,
	create,
	update,
	remove,
};

export default ShipmentDutyService;
