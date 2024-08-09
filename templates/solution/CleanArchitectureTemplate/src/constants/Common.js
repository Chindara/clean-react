export const CONTROL_SIZE = 'normal';

export const PAGINATION_PROPERTIES = {
	Page: 1,
	Limit: 10,
};

export const STATUS_PROPERTIES_TABLE = {
	['Active']: 'success',
	['Inactive']: 'error',
};

export const USER_TYPE_PROPERTIES_TABLE = {
	['Admin']: 'success',
	['Officer']: 'warning',
	['User']: 'error',
};

export const PURCHASE_ORDER_STATUS_COLOR = {
	['Outstanding']: 'error',
	['InProgress']: 'warning',
	['Partial']: 'secondary',
	['Cleared']: 'success',
};

export const PAYMENT_METHOD = {
	DA: 'DA',
	DP: 'DP',
	LC: 'LC',
	OA: 'OA',
	TT: 'TT',
};

export const FUNCTIONS = {
	Dashboard: 999,
	Documentation: 998,

	Company: 1000,
	Role: 1001,
	User: 1002,

	Bank: 1003,
	Beneficiary: 1004,
	ClearingAgent: 1005,
	Entity: 1006,
	HSCode: 1007,
	IncoTerm: 1008,
	LicenseApproval: 1009,
	NatureOfPurchase: 1010,
	PaymentMethod: 1011,
	Port: 1012,
	ShipmentCostCategory: 1013,
	ShipmentPaymentType: 1014,
	Vendor: 1015,

	PurchaseOrder: 2000,
	PurchaseOrderBank: 2001,
	PurchaseOrderHistory: 2002,

	Shipment: 3000,
	Guarantees: 3001,
	LogisticsInvoices: 3002,
	Duty: 3003,

	NonPoShipment: 3004,

	TotalShipmentRegisterReport: 4000,
	TotalCostReport: 4001,
	CustomsClearanceLeadTimeReport: 4002,
	OutstandingShippingGuaranteeReport: 4003,
	OutstandingBankGuaranteeReport: 4004,
	OpenAccountPaymentReport: 4005,
	UnderCustomsClearanceReport: 4006,
	PurchaseOrderReport: 4007,
	OutstandingTTReport: 4008,
	LogisticsInvoiceReport: 4009,
	DutyUpdateReport: 4010,
	DemurrageReport: 4011,
	ContainerDepositReport: 4012,
	InsuranceReport: 4013,

	//NonPoShipment:4014,
};

export const SHIPMENT_STATUS_COLOR = {
	['InTransit']: 'error',
	['UnderClearance']: 'warning',
	['Cleared']: 'success',
};

export const SHIPMENT_STATUS = {
	['InTransit']: 1,
	['UnderClearance']: 2,
	['Cleared']: 3,
};

export const NONPOSHIPMENT_STATUS = {
	['InTransit']: 1,
	['UnderClearance']: 2,
	['Cleared']: 3,
};
