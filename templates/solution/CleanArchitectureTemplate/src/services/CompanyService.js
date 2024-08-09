import axios from './../lib/axios-config';

const getAll = (companyId, page, limit) => {
	//return axios.get(`/Companies?page=${page}&limit=${limit}`);
	return axios.get(`/Companies/${companyId}/Children?page=${page}&limit=${limit}`);
};

const getById = (id) => {
	return axios.get(`/Companies/${id}`);
};

const getCompanyAssignedUsersById = (companyId) => {
	return axios.get(`Companies/${companyId}/Users`);
};

// const getLookupUsers = (companyId) => {
// 	return axios.get(`Lookups/User/${companyId}`);
// };

const create = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.post('Companies', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const Users = async (data) => {
	console.log('Request Data:', data);
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.put('Companies/Users', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		console.error('Error:', error);
		return initialResponse;
	}
};

const update = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.put('Companies', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const deleteCompany = async (data) => {
	const initialResponse = { isSuccess: false };
	console.log(data);

	try {
		const { data: apiResponse = {} } = await axios.delete('Companies', { data: data });

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const CompanyService = {
	getAll,
	getById,
	create,
	Users,
	update,
	//getLookupUsers,
	deleteCompany,
	getCompanyAssignedUsersById,
};

export default CompanyService;
