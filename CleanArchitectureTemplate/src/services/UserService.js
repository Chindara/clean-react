import axios from '../lib/axios-config';

const getAll = (companyId, page, limit) => {
	//return axios.get(`/Companies?page=${page}&limit=${limit}`);
	return axios.get(`/users/${companyId}?page=${page}&limit=${limit}`);
};

const getById = (companyId, id) => {
	return axios.get(`/users/${companyId}/${id}`);
};

const getUsersCompanies = (id) => {
	return axios.get(`Users/${id}/Companies`);
};

const create = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.post('users', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const update = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.put('users', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const remove = async (data) => {
	const initialResponse = { isSuccess: false };
	console.log(data);

	try {
		const { data: apiResponse = {} } = await axios.delete('Users', { data });

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const UserService = {
	getAll,
	getById,
	create,
	update,
	remove,
	getUsersCompanies,
};

export default UserService;
