import axios from '../lib/axios-config';

const getApprovals = (companyId) => {
	return axios.get(`/v1/Lookups/Approval/${companyId}`);
};

const getBanks = (companyId) => {
	return axios.get(`/v1/Lookups/Bank/${companyId}`);
};

const getVendors = (companyId) => {
	return axios.get(`/v1/Lookups/Vendor/${companyId}`);
};

const getBeneficiaries = (companyId) => {
	return axios.get(`/v1/Lookups/Beneficiary/${companyId}`);
};

// const getCountries = (companyId) => {
// 	return axios.get(`/v/Lookups/Country/${companyId}`);
// };

const getCountriesV2 = () => {
	return axios.get(`/v2/Lookups/Country`);
};

const getClearingAgents = (companyId) => {
	return axios.get(`/v1/Lookups/ClearingAgent/${companyId}`);
};

const getCurrencies = (companyId) => {
	return axios.get(`/v1/Lookups/Currency/${companyId}`);
};

const getCurrenciesV2 = () => {
	return axios.get(`/v2/Lookups/Currency`);
};

const getFunctions = () => {
	return axios.get(`/v1/Lookups/Function`);
};

const getIncoTerms = (companyId) => {
	return axios.get(`/v1/Lookups/IncoTerm/${companyId}`);
};

const getEntities = (companyId) => {
	return axios.get(`/v1/Lookups/Entity/${companyId}`);
};

const getPurchaseOrders = (companyId, purchaseId) => {
	return axios.get(`/v1/Lookups/PurchaseOrder/${companyId}/${purchaseId}`);
};

const getPaymentTypes = (companyId) => {
	return axios.get(`/v1/Lookups/PaymentType/${companyId}`);
};

const getRoles = (companyId) => {
	return axios.get(`/v1/Lookups/Role/${companyId}`);
};

const getPoIds = (companyId) => {
	return axios.get(`/v1/Lookups/PurchaseOrder/${companyId}`);
};

const getShipmentCategory = (companyId) => {
	return axios.get(`/v1/Lookups/ShipmentCategory/${companyId}`);
};

const getUsers = (companyId) => {
	return axios.get(`/v1/Lookups/User/${companyId}`);
};

const getPoIdsV2 = (companyId, status) => {
	return axios.get(`/v2/Lookups/PurchaseOrder/${companyId}/${status}`);
};

const getCompanyHomes = (companyId) => {
	return axios.get(`/v1/Lookups/CompanyHome/${companyId}`);
};

const getDashboards = (companyId) => {
	return axios.get(`/v1/Lookups/Dashboard/${companyId}`);
};

const getPorts = (companyId) => {
	return axios.get(`/v1/Lookups/Port/${companyId}`);
};

const getNatureOfPurchase = (companyId) => {
	return axios.get(`/v1/Lookups/NatureOfPurchase/${companyId}`);
};

const getNewPurchaseOrders = (companyId, purchaseId) => {
	return axios.get(`/v2/Lookups/RelatedPurchaseOrder/${companyId}/${purchaseId}`);
};

const getSubPaymentMethod = (companyId) => {
	return axios.get(`/v1/Lookups/SubPaymentMethod/${companyId}`);
};

const getEntity = (companyId) => {
	return axios.get(`/v1/Lookups/Entity/${companyId}`);
};

const LookupService = {
	//getCountries,
	getCountriesV2,
	getCurrencies,
	getCurrenciesV2,
	getIncoTerms,
	getEntities,
	getVendors,
	getCompanyHomes,
	getUsers,
	getFunctions,
	getRoles,
	getDashboards,
	getPoIds,
	getClearingAgents,
	getBeneficiaries,
	getShipmentCategory,
	getBanks,
	getPurchaseOrders,
	getApprovals,
	getPoIdsV2,
	getPaymentTypes,
	getPorts,
	getNatureOfPurchase,
	getNewPurchaseOrders,
	getSubPaymentMethod,
	getEntity,
};

export default LookupService;
