import axios from '../lib/axios-config';

const login = async (data) => {
	const initialResponse = { isLogin: false, token: '', fullName: '', userId: 0, companyId: 0, message: '' };

	try {
		const { data: apiResponse = {} } = await axios.post('Auth/Login', data);
		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		console.log(error.response.data[0]);
		return { ...initialResponse, errorMSG: error.response.data[0] };
	}
};

const changePassword = async (data) => {
	const initialResponse = { isSuccess: false };

	try {
		const { data: apiResponse = {} } = await axios.post('Auth/ChangePassword', data);

		return { ...initialResponse, ...apiResponse };
	} catch (error) {
		return initialResponse;
	}
};

const AuthService = {
	login,
	changePassword,
};

export default AuthService;
