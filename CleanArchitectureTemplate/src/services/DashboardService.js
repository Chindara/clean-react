// dashboardService.js
import axios from '../lib/axios-config';

const getShipmentStatus = (companyId, startDate, endDate) => {
	return axios.get(`/Dashboard/ShipmentStatus/${companyId}/${startDate}/${endDate}`);
};

const getPurchaseStatus = (companyId, startDate, endDate) => {
	return axios.get(`/Dashboard/PurchaseStatus/${companyId}/${startDate}/${endDate}`);
};

const getArrivalStatus = (companyId, startDate, endDate) => {
	return axios.get(`/Dashboard/ArrivalStatus/${companyId}/${startDate}/${endDate}`);
};

// const getPurcmentCount = (companyId) => {
// 	return axios.get(`/Dashboard/PurcmentCount/${companyId}`);
// };

const getTileCounts = (companyId, startDate, endDate) => {
	return axios.get(`/Dashboard/TileCounts/${companyId}/${startDate}/${endDate}`);
};

const getUpcomingShipments = (companyId, startDate) => {
	return axios.get(`/Dashboard/UpcomingShipments/${companyId}/${startDate}`);
};

const getLCExpirations = (companyId, startDate, endDate) => {
	return axios.get(`/Dashboard/LCExpirations/${companyId}/${startDate}/${endDate}`);
};

const DashboardService = {
	getShipmentStatus,
	getPurchaseStatus,
	getArrivalStatus,
	//getPurcmentCount,
	getTileCounts,
	getUpcomingShipments,
	getLCExpirations,
};

export default DashboardService;
