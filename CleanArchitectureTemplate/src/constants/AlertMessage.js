// Define the base set of common errors
const BASE_ERROR_MESSAGES = {
	GetRecords: 'Error fetching Records',
	GetRecord: 'Error fetching Record',
	RecordCreated: 'Error occurred while creating',
	RecordDeleted: 'Error occurred while deleting',
	RecordUpdated: 'Error occurred while updating',
	CheckAvailability: 'Error occurred while checking availability',
};

export const AUTH_ALERT = {
	Success: {
		PasswordChanged: 'User password changed successfully',
	},
	Error: {
		PasswordChanged: 'Error occurred while changing the user password',
	},
};

export const COMPANY_ALERT = {
	Success: {
		CompanyCreated: 'Company successfully created',
		CompanyUpdated: 'Company successfully updated',
		CompanyDeleted: 'Company successfully deleted',
		AssignUserCreated: 'User Assigned Successfully',
		AssignUserUpdated: 'Assign User successfully updated',
		AssignUserDeleted: 'Assign User successfully deleted',
	},
	Warning: {
		CompanyUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllCompanies: 'Error fetching Companies',
		GetCompany: 'Error fetching Company',
		CompanyCreated: 'Error occurred while creating',
		CompanyDeleted: 'Error occurred while deleting',
		CompanyUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Company availability',
		AssignUserCreated: 'Error occurred while creating',
		AssignUserUpdated: 'Error occurred while deleting',
		AssignUserDeleted: 'Error occurred while updating',
	},
};

export const CURRENCY_ALERT = {
	Success: {
		CurrencyCreated: 'Currency successfully created',
		CurrencyUpdated: 'Currency successfully updated',
		CurrencyDeleted: 'Currency successfully deleted',
	},
	Warning: {
		CurrencyUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllCurrencies: 'Error fetching Currencies',
		GetCurrency: 'Error fetching Currency',
		CurrencyCreated: 'Error occurred while creating',
		CurrencyDeleted: 'Error occurred while deleting',
		CurrencyUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Currency availability',
	},
};

export const ENTITY_ALERT = {
	Success: {
		EntityCreated: 'Entity successfully created',
		EntityUpdated: 'Entity successfully updated',
		EntityDeleted: 'Entity successfully deleted',
	},
	Warning: {
		EntityUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllEntities: 'Error fetching Entities',
		GetEntity: 'Error fetching Entity',
		EntityCreated: 'Error occurred while creating',
		EntityDeleted: 'Error occurred while deleting',
		EntityUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Entity availability',
	},
};
export const PAYMENT_ALERT = {
	Success: {
		PaymentCreated: 'Payment Method successfully created',
		PaymentUpdated: 'Payment Method successfully updated',
		PaymentDeleted: 'Payment Method successfully deleted',
	},
	Warning: {
		PaymentUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllPayments: 'Error fetching Payment Methods',
		GetPayment: 'Error fetching Payment Method',
		PaymentCreated: 'Error occurred while creating',
		PaymentDeleted: 'Error occurred while deleting',
		PaymentUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Payment Method availability',
	},
};

export const PURCHASE_ORDER_ALERT = {
	Success: {
		PurchaseOrderCreated: 'Purchase Order successfully created',
		PurchaseOrderUpdated: 'Purchase Order successfully updated',
		PurchaseOrderDeleted: 'Purchase Order successfully deleted',
	},
	Warning: {
		PurchaseOrderUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		...BASE_ERROR_MESSAGES,
		GetAllPurchaseOrders: 'Error fetching Purchase Orders',
		//GetPurchaseOrder: 'Error fetching Currency',
		PurchaseOrderCreated: 'Error occurred while creating',
		PurchaseOrderDeleted: 'Error occurred while deleting',
		PurchaseOrderUpdated: 'Error occurred while updating',
		//CheckAvailability: 'Error occurred while checking availability',
	},
	Info: {
		CheckingPurchaseNo: 'Checking availability',
	},
};

export const BULK_UPLOAD_ALERT = {
	Success: {
		BulkUploadCreated: 'Bulk Upload successfully created',
		BulkUploadUpdated: 'Bulk Upload successfully updated',
		BulkUploadDeleted: 'Bulk Upload successfully deleted',
	},
	Warning: {
		BulkUploadUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		UploadFailed: 'Upload failed',
		GetAllBulkUploads: 'Error fetching Bulk Uploads',
		BulkUploadCreated: 'Error occurred while creating',
		BulkUploadDeleted: 'Error occurred while deleting',
		BulkUploadUpdated: 'Error occurred while updating',
	},
};

export const PURCHASE_ORDER_BANK_ALERT = {
	Success: {
		PurchaseOrderBankCreated: 'Purchase Order Bank successfully created',
		PurchaseOrderBankUpdated: 'Purchase Order Bank successfully updated',
	},
	Warning: {
		NoChange: 'No changes have been made',
	},
	Error: {
		PurchaseOrderBankCreated: 'Error occurred while creating',
		PurchaseOrderBankDeleted: 'Error occurred while deleting',
		PurchaseOrderBankUpdated: 'Error occurred while updating',
		PaymentMethodNotFound: 'Payment method not found',
		PaymentMethodInvalid: 'Payment method invalid',
		GetPurchaseOrderBank: 'Error fetching purchase order bank',
		GetBanks: 'Error fetching banks',
	},
};

export const PURCHASE_ORDER_HISTORY_ALERT = {
	Success: {
		PurchaseOrderHistoryCreated: 'Purchase Order History successfully created',
	},
	Error: {
		PurchaseOrderHistoryCreated: 'Error occurred while creating',
		GetPurchaseOrderHistory: 'Error fetching History Details',
	},
};
export const SHIPMENT_ALERT = {
	Success: {
		ShipmentCreated: 'Shipment successfully created',
		ShipmentUpdated: 'Shipment successfully updated',
		ShipmentDeleted: 'Shipment successfully deleted',
	},
	Warning: {
		ShipmentUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllShipments: 'Error fetching Shipments',
		GetShipment: 'Error fetching Shipment',
		ShipmentCreated: 'Error occurred while creating',
		ShipmentDeleted: 'Error occurred while deleting',
		ShipmentUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Shipment availability',
	},
};

export const NON_PO_SHIPMENT_ALERT = {
	Success: {
		NonPoShipmentCreated: 'Non-PO Shipment successfully created',
		NonPoShipmentUpdated: 'Non-PO Shipment successfully updated',
		NonPoShipmentDeleted: 'Non-PO Shipment successfully deleted',
	},
	Warning: {
		ShipmentUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllShipments: 'Error fetching Shipments',
		GetShipment: 'Error fetching Shipment',
		ShipmentCreated: 'Error occurred while creating',
		ShipmentDeleted: 'Error occurred while deleting',
		ShipmentUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Shipment availability',
	},
};

export const SHIPMENT_LOGISTICS_INVOICES_ALERT = {
	Success: {
		ShipmentLogisticsInvoiceCreated: 'Logistics Invoices successfully created',
		ShipmentLogisticsInvoiceUpdated: 'Logistics Invoices successfully updated',
		ShipmentLogisticsInvoiceDeleted: 'Logistics Invoices successfully deleted',
	},
	Warning: {
		ShipmentLogisticsInvoiceUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllShipmentLogisticsInvoices: 'Error fetching Logistics Invoices',
		GetShipmentLogisticsInvoice: 'Error fetching Logistics Invoice',
		ShipmentLogisticsInvoiceCreated: 'Error occurred while creating',
		ShipmentLogisticsInvoiceDeleted: 'Error occurred while deleting',
		ShipmentLogisticsInvoiceUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Logistics Invoice availability',
	},
};
export const SHIPMENT_PAYMENT_TYPE_ALERT = {
	Success: {
		ShipmentPaymentTypeCreated: 'Shipment payment Type successfully created',
		ShipmentPaymentTypeUpdated: 'Shipment payment Type successfully updated',
		ShipmentPaymentTypeDeleted: 'Shipment payment Type successfully deleted',
	},
	Warning: {
		ShipmentPaymentUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllShipmentPayments: 'Error fetching Shipment Payment Types',
		GetShipmentPayment: 'Error fetching Shipment Payment Types',
		ShipmentPaymentTypeCreated: 'Error occurred while creating',
		ShipmentPaymentTypeDeleted: 'Error occurred while deleting',
		ShipmentPaymentTypeUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Shipment Payment Type availability',
	},
};
export const GUARANTEE_ALERT = {
	Success: {
		GuaranteeCreated: 'Guarantee successfully created',
		GuaranteeUpdated: 'Guarantee successfully updated',
		GuaranteeDeleted: 'Guarantee successfully deleted',
	},
	Warning: {
		GuaranteeUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllGuarantees: 'Error fetching Guarantees',
		GetGuarantee: 'Error fetching Guarantee',
		GuaranteeCreated: 'Error occurred while creating',
		GuaranteeDeleted: 'Error occurred while deleting',
		GuaranteeUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Guarantee availability',
	},
};
export const SHIPMENT_DUTY_ALERT = {
	Success: {
		ShipmentDutyCreated: 'Shipment Duty successfully created',
		ShipmentDutyUpdated: 'Shipment Duty successfully updated',
		ShipmentDutyDeleted: 'Shipment Duty successfully deleted',
	},
	Warning: {
		ShipmentDutyUpdated: 'Please complete the form(s)',
		NoChange: 'No change have been made',
	},
	Error: {
		GetAllShipmentDuties: 'Error fetching Shipment Duties',
		GetShipmentDuty: 'Error fetching Shipment Duty',
		ShipmentDutyCreated: 'Error occurred while creating',
		ShipmentDutyDeleted: 'Error occurred while deleting',
		ShipmentDutyUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Shipment Duty availability',
	},
};

export const COUNTRY_ALERT = {
	Success: {
		CountryCreated: 'Country successfully created',
		CountryUpdated: 'Country successfully updated',
		CountryDeleted: 'Country successfully deleted',
	},
	Warning: {
		CountryUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllCountries: 'Error fetching Countries',
		GetCountry: 'Error fetching Country',
		CountryCreated: 'Error occurred while creating',
		CountryDeleted: 'Error occurred while deleting',
		CountryUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Country availability',
	},
};
export const VENDOR_ALERT = {
	Success: {
		VendorCreated: 'Vendor successfully created',
		VendorUpdated: 'Vendor successfully updated',
		VendorDeleted: 'Vendor successfully deleted',
	},
	Warning: {
		VendorUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllVendors: 'Error fetching Vendors',
		VendorCreated: 'Error occurred while creating',
		VendorDeleted: 'Error occurred while deleting',
		VendorUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Vendor availability',
	},
};

export const INCOTERM_ALERT = {
	Success: {
		IncotermCreated: 'Incoterm successfully created',
		IncotermUpdated: 'Incoterm successfully updated',
		IncotermDeleted: 'Incoterm successfully deleted',
	},
	Warning: {
		IncotermUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllIncoterms: 'Error fetching Incoterms',
		IncotermCreated: 'Error occurred while creating',
		IncotermDeleted: 'Error occurred while deleting',
		IncotermUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Incoterm availability',
	},
};

export const HS_CODE_ALERT = {
	Success: {
		HsCodeCreated: 'HsCode successfully created',
		HsCodeUpdated: 'HsCode successfully updated',
		HsCodeDeleted: 'HsCode successfully deleted',
	},
	Warning: {
		HsCodeUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllHsCodes: 'Error fetching HsCodes',
		HsCodeCreated: 'Error occurred while creating',
		HsCodeDeleted: 'Error occurred while deleting',
		HsCodeUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking HsCode availability',
	},
};

export const USER_ALERT = {
	Success: {
		UserCreated: 'User successfully created',
		UserUpdated: 'User successfully updated',
		UserDeleted: 'User successfully deleted',
	},
	Warning: {
		UserUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllUsers: 'Error fetching Users',
		UserCreated: 'Error occurred while creating',
		UserDeleted: 'Error occurred while deleting',
		UserUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking User availability',
	},
};
export const ROLE_ALERT = {
	Success: {
		RoleCreated: 'Role successfully created',
		RoleUpdated: 'Role successfully updated',
		RoleDeleted: 'Role successfully deleted',
	},
	Warning: {
		UserUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllRoles: 'Error fetching Roles',
		RoleCreated: 'Error occurred while creating',
		RoleDeleted: 'Error occurred while deleting',
		RoleUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Role availability',
	},
};
export const PAYMENT_TYPE_ALERT = {
	Success: {
		PaymentTypeCreated: 'Payment Type successfully created',
		PaymentTypeUpdated: 'Payment Type successfully updated',
		PaymentTypeDeleted: 'Payment Type successfully deleted',
	},
	Warning: {
		PaymentTypeUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllRoles: 'Error fetching Payment Type',
		PaymentTypeCreated: 'Error occurred while creating',
		PaymentTypeDeleted: 'Error occurred while deleting',
		PaymentTypeUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Payment Type availability',
	},
};

export const SUB_PAYMENT_METHOD_ALERT = {
	Success: {
		SubPaymentMethodCreated: 'Sub Payment Method successfully created',
		SubPaymentMethodUpdated: 'Sub Payment Method successfully updated',
		SubPaymentMethodDeleted: 'Sub Payment Method successfully deleted',
	},
	Warning: {
		SubPaymentMethodUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllRoles: 'Error fetching Payment Method',
		SubPaymentMethodCreated: 'Error occurred while creating',
		SubPaymentMethodDeleted: 'Error occurred while deleting',
		SubPaymentMethodUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Sub Payment Method availability',
	},
};

export const PORT_ALERT = {
	Success: {
		PortCreated: 'Port successfully created',
		PortUpdated: 'Port successfully updated',
		PortDeleted: 'Port successfully deleted',
	},
	Warning: {
		PortUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllRoles: 'Error fetching Ports',
		PortCreated: 'Error occurred while creating',
		PortDeleted: 'Error occurred while deleting',
		PortUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Port availability',
	},
};
export const BENEFICIARY_ALERT = {
	Success: {
		BeneficiaryCreated: 'Beneficiary successfully created',
		BeneficiaryUpdated: 'Beneficiary successfully updated',
		BeneficiaryDeleted: 'Beneficiary successfully deleted',
	},
	Warning: {
		BeneficiaryUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllRoles: 'Error fetching Beneficiaries',
		BeneficiaryCreated: 'Error occurred while creating',
		BeneficiaryDeleted: 'Error occurred while deleting',
		BeneficiaryUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Beneficiary availability',
	},
};
export const NATURE_ALERT = {
	Success: {
		NatureCreated: 'Nature of Purchase successfully created',
		NatureUpdated: 'Nature of Purchase successfully updated',
		NatureDeleted: 'Nature of Purchase successfully deleted',
	},
	Warning: {
		UserUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllRoles: 'Error fetching Nature of Purchase',
		NatureCreated: 'Error occurred while creating',
		NatureDeleted: 'Error occurred while deleting',
		NatureUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Role availability',
	},
};

export const COMPANY_HOME_ALERT = {
	Success: {
		CompanyHomeCreated: 'Company Home successfully created',
		CompanyHomeUpdated: 'Company Home successfully updated',
		CompanyHomeDeleted: 'Company Home successfully deleted',
	},
	Warning: {
		CompanyHomeUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllCurrencies: 'Error fetching Currencies',
		GetPurchaseOrder: 'Error fetching Currency',
		CompanyHomeCreated: 'Error occurred while creating',
		CompanyHomeDeleted: 'Error occurred while deleting',
		CompanyHomeUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Company Home availability',
	},
};

export const DASHBOARD_ALERT = {
	Success: {
		CompanyHomeCreated: 'Company Home successfully created',
		CompanyHomeUpdated: 'Company Home successfully updated',
		CompanyHomeDeleted: 'Company Home successfully deleted',
	},
	Warning: {
		CompanyHomeUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllCurrencies: 'Error fetching Currencies',
		GetPurchaseOrder: 'Error fetching Currency',
		CompanyHomeCreated: 'Error occurred while creating',
		CompanyHomeDeleted: 'Error occurred while deleting',
		CompanyHomeUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Company Home availability',
	},
};

export const BANK_ALERT = {
	Success: {
		BankCreated: 'Bank successfully created',
		BankUpdated: 'Bank successfully updated',
		BankDeleted: 'Bank successfully deleted',
	},
	Warning: {
		BankUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllBanks: 'Error fetching Banks',
		BankCreated: 'Error occurred while creating',
		BankDeleted: 'Error occurred while deleting',
		BankUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Bank availability',
	},
};

export const CLEARING_AGENT_ALERT = {
	Success: {
		ClearingAgentCreated: 'Clearing Agent successfully created',
		ClearingAgentUpdated: 'Clearing Agent successfully updated',
		ClearingAgentDeleted: 'Clearing Agent successfully deleted',
	},
	Warning: {
		ClearingAgentUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllClearingAgent: 'Error fetching Clearing Agents',
		ClearingAgentCreated: 'Error occurred while creating',
		ClearingAgentDeleted: 'Error occurred while deleting',
		ClearingAgentUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Clearing Agent availability',
	},
};

export const GUARANTEE_CATEGORY_ALERT = {
	Success: {
		GuaranteeCategoryCreated: 'Guarantee Category successfully created',
		GuaranteeCategoryUpdated: 'Guarantee Category successfully updated',
		GuaranteeCategoryDeleted: 'Guarantee Category successfully deleted',
	},
	Warning: {
		GuaranteeCategoryUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllGuaranteeCategory: 'Error fetching Guarantee Categories',
		GuaranteeCategoryCreated: 'Error occurred while creating',
		GuaranteeCategoryDeleted: 'Error occurred while deleting',
		GuaranteeCategoryUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Guarantee Category availability',
	},
};

export const LICENSE_APPROVAL_ALERT = {
	Success: {
		LicenseApprovalCreated: 'License Approval successfully created',
		LicenseApprovalUpdated: 'License Approval successfully updated',
		LicenseApprovalDeleted: 'License Approval successfully deleted',
	},
	Warning: {
		LicenseApprovalUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllLicenseApproval: 'Error fetching License Approvals',
		LicenseApprovalCreated: 'Error occurred while creating',
		LicenseApprovalDeleted: 'Error occurred while deleting',
		LicenseApprovalUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking License Approval availability',
	},
};

export const SHIPMENT_CATEGORY_ALERT = {
	Success: {
		ShipmentCategoryCreated: 'Shipment Category successfully created',
		ShipmentCategoryUpdated: 'Shipment Category successfully updated',
		ShipmentCategoryDeleted: 'Shipment Category successfully deleted',
	},
	Warning: {
		GuaranteeCategoryUpdated: 'Please complete the form(s)',
		NoChange: 'No changes have been made',
	},
	Error: {
		GetAllShipmentCategory: 'Error fetching shipment Categories',
		ShipmentCategoryCreated: 'Error occurred while creating',
		ShipmentCategoryDeleted: 'Error occurred while deleting',
		ShipmentCategoryUpdated: 'Error occurred while updating',
		CheckAvailability: 'Error occurred while checking Shipment Category availability',
	},
};
