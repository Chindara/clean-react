export const AUTH_ERROR = {
	Login: {},
	ChangePassword: {
		newPasswordRequired: 'New Password is required',
		confirmPasswordRequired: 'Confirm Password is required',
		confirmPasswordMatchError: 'Confirm Password does not match',
	},
};

export const COMPANY_ERROR = {
	nameRequired: 'Name is required',
	addressRequired: 'Address is required',
	vatNoRequired: 'VAT No is required',
	brNoRequired: 'BR No is required',
	assignUserRequired: 'Assigning a user is required',
};
export const CURRENCY_ERROR = {
	nameRequired: 'Name is required',
};
export const PURCHASE_ORDER_ERROR = {
	poNo: 'Purchase Order No is required',
	poDate: 'Purchase Order Date is required',
	dateOfDelivery: 'Date of Delivery is required',
	natureOfPurchase: 'Nature of Purchase is required',
};
export const ENTITY_ERROR = {
	nameRequired: 'Name is required',
};
export const PAYMENT_ERROR = {
	nameRequired: 'Name is required',
};
export const COUNTRY_ERROR = {
	nameRequired: 'Name is required',
};
export const VENDOR_ERROR = {
	nameRequired: 'Name is required',
};
export const NATURE_ERROR = {
	nameRequired: 'Name is required',
};
export const BENEFICIARY_ERROR = {
	nameRequired: 'Name is required',
};
export const PAYMENT_TYPE_ERROR = {
	nameRequired: 'Name is required',
};
export const PORT_ERROR = {
	nameRequired: 'Name is required',
};
export const INCOTERM_ERROR = {
	nameRequired: 'Name is required',
};
export const HS_CODE_ERROR = {
	codeRequired: 'Code is required',
	descriptionRequired: 'Description is required',
};
export const USER_ERROR = {
	firstNameRequired: 'First Name is required',
	lastNameRequired: 'Last Name is required',
	mobileRequired: 'Mobile Number is required',
	emailRequired: 'Email is required',
	mobileValidation: 'Enter a valid mobile number',
	roleRequired: 'Role is required',
	userTypeRequired: 'User Type is required',
	emailValidation: 'Enter a valid email',
};
export const ROLE_ERROR = {
	nameRequired: 'Name is required',
	functionRequired: 'Function is required',
};
export const BANK_ERROR = {
	nameRequired: 'Name is required',
};
export const CLEARING_AGENT_ERROR = {
	nameRequired: 'Name is required',
};
export const GUARANTEE_CATEGORY_ERROR = {
	nameRequired: 'Name is required',
};
export const SHIPMENT_CATEGORY_ERROR = {
	nameRequired: 'Name is required',
};
export const SHIPMENT_PAYMENT_ERROR = {
	nameRequired: 'Name is required',
};
export const SHIPMENT_PAYMENT_TYPE_ERROR = {
	nameRequired: 'Name is required',
};
export const SUB_PAYMENT_METHOD_ERROR = {
	nameRequired: 'Name is required',
	paymentMethodRequired: 'Payment Method is required',
};

export const VALIDATION_ERROR = {
	amountRequired: 'Amount is required',
	amountFormat: 'Amount should be a positive number',
	approvalDateRequired: 'Approval Date is required',
	approvalExpiryRequired: 'Approval Expiry is required',
	approvalReferenceRequired: 'Approval Reference is required',
	approvalRequired: 'Approval is required',
	buyerRequired: 'Buyer is required',
	commentRequired: 'Comment is required',
	countryRequired: 'Country is required',
	currencyRequired: 'Currency is required',
	dateOfDeliveryRequired: 'Date of Delivery is required',
	descriptionRequired: 'Description is required',
	edaRequired: 'ETD is required',
	etaRequired: 'ETA is required',
	grnDateRequired: 'GRN Date is required',
	grnRequired: 'GRN is required',
	incoTermRequired: 'Inco Term is required',
	nameRequired: 'Name is required',
	natureOfCargoRequired: 'Nature of Cargo is required',
	natureOfPurchaseRequired: 'Nature of Purchase is required',
	paymentMethodRequired: 'Payment Method is required',
	piNoRequired: 'PI No is required',
	entityRequired: 'Entity is required',
	fileRequired: 'File is required',
	poDateRequired: 'Purchase Order Date is required',
	poNoRequired: 'Purchase Order No is required',
	poNoExists: 'Purchase Order No is already exists',
	transportModeRequired: 'Transport Mode is required',
	userRequired: 'User is required',
	vendorRequired: 'Vendor is required',
	quantityRequired: 'Quantity is Required',
	quantityFormat: 'Quantity should be a positive number',
	volumeRequired: 'Volume is Required',
	volumeFormat: 'Volume should be a positive number',
	latestDateOfShipmentRequired: 'Latest Date of Shipment is Required',
	lcExpiryDateRequired: 'LC Expiry Date is Required',
	typeOfCargoRequired: 'Type Of Cargo is required',
};

export const PURCHASE_ORDER_BANK_ERROR = {
	bankRequired: 'Bank is required',
	ttRequestDateRequired: 'TT Request Date is required',
	latestDateOfShipmentRequired: 'Latest Date of Shipment is required',
	lcExpiryDateRequired: 'LC Expiry Date is required',
};

export const VALIDATION_ERROR_SHIPMENT = {
	poIdNoRequired: 'Purchase Order No is required',
	referenceNoRequired: 'Reference No is required',
	natureOfPurchaseRequired: 'Nature Of Purchase is required',
	typeOfCargoRequired: 'Type Of Cargo is required',
	amountRequired: 'PO Amount is required',
	incoTermRequired: 'Inco Term is required',
	shipmentTypeRequired: 'Shipment Type is required',
	commercialInvoiceAmountRequired: 'Commercial Invoice Amount is required',
};

export const VALIDATION_ERROR_NONPOSHIPMENT = {
	entityRequired: 'Entity is required',
	referenceNoRequired: 'Reference No is required',
	descriptionRequired: 'Description is required',
	natureOfPurchaseRequired: 'Nature Of Purchase is required',
	typeOfCargoRequired: 'Type Of Cargo is required',
	vendorRequired: 'Vendor is required',
	buyerRequired: 'Buyer is required',
	paymentMethodRequired: 'Payment Method is required',
	transportModeRequired: 'Transport Mode is required',
	incoTermRequired: 'IncoTerm is required',
	commercialInvoiceNoRequired: 'Commercial InvoiceNo is required',
	currencyRequired: 'Currency is required',
	shipmentAmountRequired: 'Shipment Amount is required',
	shipmentTypeRequired: 'Shipment Type is required',
	blawbStatusRequired: 'BL/AWB Status is required',
	countryRequired: 'Country is required',
	etaRequired: 'ETA is required',
	blawbNoRequired: 'BL/AWB is required',
};

export const VALIDATION_ERROR_SHIPMENT_LOGISTICS_INVOICE = {
	poIdNoRequired: 'Purchase Order No is required',
	shipmentIdRequired: 'Shipment Id is required',
	currencyRequired: 'Currency is required',
	natureOfPurchaseRequired: 'Nature Of Purchase Required',
	categoryRequired: 'Category is required',
	typeRequired: 'Type is required',
	amountRequired: 'Amount is required',
	beneficiaryRequired: 'Beneficiary is required',
	paymentSubmittedDate: 'Submitted Date to Finance is required',
	invoiceDateRequired: 'Invoice Date is required',
	invoiceReceivedDateRequired: 'Invoice Received Date is required',
	paymentDueDateRequired: 'Due Date is required',
	logisticsInvoiceDateRequired: 'Invoice Date is required',
	paymentDateRequired: 'Payment Date is required',
	paymentReferenceRequired: 'Invoice Reference is required',
	remarkRequired: 'Remark is required',
};

export const VALIDATION_ERROR_GUARANTEE = {
	poIdNoRequired: 'Purchase Order No is required',
	shipmentIdRequired: 'Shipment Id is required',
	bankRequired: 'Bank is required',
	currencyRequired: 'Currency is required',
	typeRequired: 'Guarantee Type is required',
	amountRequired: 'Amount is required',
	beneficiaryRequired: 'Beneficiary is required',
	issueDateRequired: 'Issue Date is required',
	expiryDateRequired: 'Expiry Date is required',
	extendedDateRequired: 'Extended Date is required',
	remarkRequired: 'Remark is required',
	guaranteeCategory: 'Guarantee Category Date is required',
};
export const VALIDATION_ERROR_SHIPMENT_DUTY = {
	poIdNoRequired: 'Purchase Order No is required',
	shipmentIdRequired: 'Shipment Id is required',

	hsCodeRequired: 'hsCode is required',
	submittedDateToFinanceRequired: 'Submitted Date To Finance is required',
	paymentDateRequired: 'Payment Date is required',
	paymentReferenceRequired: 'Payment Reference is required',
	remarkRequired: 'Remark is required',
	Required: ' is required',
	cidRequired: 'CID is required',
	vatRequired: 'VAT is required',
	palRequired: 'PAL is required',
	xidRequired: 'XID is required',
	eicRequired: 'EIC is required',
	sslRequired: 'SSL is required',
	sclRequired: 'SCL is required',
	penaltyRequired: 'Penalty is required',
	surchargeRequired: 'Surcharge is required',
	additionalChargesRequired: 'Additional Charges required',
	totalDutyUpdateRequired: `Total Duty Update Required`,

	cidValidation: 'Enter a valid CID',
	vatValidation: 'Enter a valid VAT',
	palValidation: 'Enter a valid PAL',
	xidValidation: 'Enter a valid XID',
	eicValidation: 'Enter a valid EIC',
	sslValidation: 'Enter a valid SSL',
	sclValidation: 'Enter a valid SCL',
	penaltyValidation: 'Enter a valid Penalty',
	surchargeValidation: 'Enter a valid Surcharge',
	additionalChargesValidation: 'Enter a valid Additional',
};
