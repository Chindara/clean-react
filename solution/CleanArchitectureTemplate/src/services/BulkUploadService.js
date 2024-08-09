import axios from '../lib/axios-config';

const getAll = (companyId, page, size) => {
	return axios.get(`/bulkUploads/${companyId}?page=${page}&size=${size}`);
};

const getById = (companyId, id) => {
	return axios.get(`/bulkUploads/${companyId}/${id}`);
};

const create = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.post('bulkUploads', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};



const BulkUploadService = {
	getAll,
	getById,
	create,
};

export default BulkUploadService;