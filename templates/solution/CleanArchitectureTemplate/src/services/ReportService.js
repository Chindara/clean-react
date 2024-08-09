import axios from '../lib/axios-config';

const getTotalShipmentRegister = (companyId, startDate, endDate, purchaseId, searchVisible) => {
	console.log(purchaseId)
	if (searchVisible && (startDate || endDate )) {


		console.log(purchaseId)

		return axios.get(`/Reports/${companyId}/TotalShipmentRegister`, {
			params: {
				startDate: startDate || '',
				endDate: endDate || '',
				purchaseId,
			}
		});
	}

	return Promise.resolve({ data: { items: []} });
};

const getPurchaseOrder = (companyId, startDate, endDate, purchaseId, searchVisible) => {
	console.log(purchaseId)
	if (searchVisible && (startDate || endDate )) {


		console.log(purchaseId)

		return axios.get(`/Reports/${companyId}/PurchaseOrder/${purchaseId}`, {
			params: {
				StartDate: startDate || '',
				EndDate: endDate || '',
			}
		});
	}

	return Promise.resolve({ data: { items: [] } });
};

const getUnderCustomClearance = (companyId, startDate, endDate, purchaseId, searchVisible) => {
	console.log(purchaseId)
	if (searchVisible && (startDate || endDate )) {


		console.log(purchaseId)

		return axios.get(`/Reports/${companyId}/UnderCustomClearance/${purchaseId}`, {
			params: {
				StartDate: startDate || '',
				EndDate: endDate || '',
			}
		});
	}

	return Promise.resolve({ data: { items: [] } });
};

const getOutstandingTT = (companyId, startDate, endDate, purchaseId, searchVisible) => {
	console.log(purchaseId)
	if (searchVisible && (startDate || endDate )) {


		console.log(purchaseId)

		return axios.get(`/Reports/${companyId}/OutstandingTT/${purchaseId}`, {
			params: {
				startDate: startDate || '',
				endDate: endDate || '',
			}
		});
	}

	return Promise.resolve({ data: { items: [] } });
};

const getOpenAccountPayment = (companyId, startDate, endDate, purchaseId, searchVisible) => {
	console.log(purchaseId)
	if (searchVisible && (startDate || endDate )) {


		console.log(purchaseId)

		return axios.get(`/Reports/${companyId}/OpenAccountPayment/${purchaseId}`, {
			params: {
				startDate: startDate || '',
				endDate: endDate || '',
			}
		});
	}

	return Promise.resolve({ data: { items: [] } });
};

const getOutStandingShippingGuarantee = (companyId, startDate, endDate, purchaseId, searchVisible) => {
	console.log(purchaseId)
	if (searchVisible && (startDate || endDate )) {

		return axios.get(`/Reports/${companyId}/OutStandingShippingGuarantee/${purchaseId}`, {
			params: {
				startDate: startDate || '',
				endDate: endDate || '',
			}
		});
	}

	return Promise.resolve({ data: { items: [] } });
};

const getOutStandingBankGuarantee = (companyId, startDate, endDate, purchaseId, searchVisible) => {
	console.log(purchaseId)
	if (searchVisible && (startDate || endDate )) {


		console.log(purchaseId)

		return axios.get(`/Reports/${companyId}/OutStandingBankGuarantee/${purchaseId}`, {
			params: {
				startDate: startDate || '',
				endDate: endDate || '',
			}
		});
	}

	return Promise.resolve({ data: { items: [] } });
};

const getCustomClearanceLeadTime = (companyId, startDate, endDate, purchaseId, searchVisible) => {
	console.log(purchaseId)
	if (searchVisible && (startDate || endDate )) {


		console.log(purchaseId)

		return axios.get(`/Reports/${companyId}/CustomClearanceLeadTime/${purchaseId}`, {
			params: {
				startDate: startDate || '',
				endDate: endDate || '',
			}
		});
	}

	return Promise.resolve({ data: { items: [] } });
};

const getTotalCost = (companyId, startDate, endDate, purchaseId, shipmentId, searchVisible) => {
	console.log(purchaseId)
	if (searchVisible && (startDate || endDate )) {


		console.log(purchaseId)

		return axios.get(`/Reports/${companyId}/TotalCost/${purchaseId}/${shipmentId}`, {
			params: {
				startDate: startDate || '',
				endDate: endDate || '',
			}
		});
	}

	return Promise.resolve({ data: { items: [] } });
};

const getLogisticInvoice = (companyId, startDate, endDate, purchaseId, searchVisible) => {
	console.log(purchaseId)
	if (searchVisible && (startDate || endDate )) {


		console.log(purchaseId)

		return axios.get(`/Reports/${companyId}/LogisticInvoice/${purchaseId}`, {
			params: {
				startDate: startDate || '',
				endDate: endDate || '',
			}
		});
	}

	return Promise.resolve({ data: { items: [] } });
};

const getDutyUpdate = (companyId, startDate, endDate, purchaseId, searchVisible) => {
	console.log(purchaseId)
	if (searchVisible && (startDate || endDate )) {


		console.log(purchaseId)

		return axios.get(`/Reports/${companyId}/DutyUpdate/${purchaseId}`, {
			params: {
				startDate: startDate || '',
				endDate: endDate || '',
			}
		});
	}

	return Promise.resolve({ data: { items: []} });
};

const getDemurrage = (companyId, startDate, endDate, purchaseId, searchVisible) => {
	console.log(purchaseId)
	if (searchVisible && (startDate || endDate )) {


		console.log(purchaseId)

		return axios.get(`/Reports/${companyId}/Demurrage/${purchaseId}`, {
			params: {
				startDate: startDate || '',
				endDate: endDate || '',
			}
		});
	}

	return Promise.resolve({ data: { items: [] } });
};

const getContainerDeposit = (companyId, startDate, endDate, purchaseId, searchVisible) => {
	console.log(purchaseId)
	if (searchVisible && (startDate || endDate )) {


		console.log(purchaseId)

		return axios.get(`/Reports/${companyId}/ContainerDeposit/${purchaseId}`, {
			params: {
				startDate: startDate || '',
				endDate: endDate || '',
			}
		});
	}

	return Promise.resolve({ data: { items: []} });
};

const getInsurance = (companyId, startDate, endDate, purchaseId, searchVisible) => {
	console.log(purchaseId)
	if (searchVisible && (startDate || endDate )) {


		console.log(purchaseId)

		return axios.get(`/Reports/${companyId}/Insurance/${purchaseId}`, {
			params: {
				startDate: startDate || '',
				endDate: endDate || '',
			}
		});
	}

	return Promise.resolve({ data: { items: [] } });
};

const ReportService = {
	getTotalShipmentRegister,
	getPurchaseOrder,
	getUnderCustomClearance,
	getOutstandingTT,
	getOpenAccountPayment,
	getOutStandingShippingGuarantee,
	getOutStandingBankGuarantee,
	getCustomClearanceLeadTime,
	getTotalCost,
	getLogisticInvoice,
	getDutyUpdate,
	getDemurrage,
	getContainerDeposit,
	getInsurance,
};

export default ReportService;
