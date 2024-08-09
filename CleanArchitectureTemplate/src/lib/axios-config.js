import axios from 'axios';

let baseURL = '';

console.log(`ShipTrak Pro is running in ${import.meta.env.VITE_BUILD} mode`);

switch (import.meta.env.VITE_BUILD) {
	case 'DEV':
		baseURL = import.meta.env.VITE_API_URL_DEV;
		break;
	case 'QA':
		baseURL = import.meta.env.VITE_API_URL_QA;
		break;
	case 'UAT':
		baseURL = import.meta.env.VITE_API_URL_UAT;
		break;
	case 'PRD':
		baseURL = import.meta.env.VITE_API_URL_PRD;
		break;
}

const instance = axios.create({
	baseURL: baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
});

export default instance;
