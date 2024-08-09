export const OPERATION_MODE = {
	Create: 1,
	Edit: 2,
	View: 3,
	Delete: 4,
	Other: 5,
	AssignUser: 6,
	ShipmentPayment:7,
};

export const KEBAB_MENU_MODE = {
	Create: 1,
	Edit: 2,
	View: 3,
	Delete: 4,
	Other: 5,
	AssignUser: 6,
	Guarantee: 7,
};

export const USER_MODE = {
	Create: 1,
	Edit: 2,
	View: 3,
	Delete: 4,
	ResetPassword: 5,
	Other: 6,
};

export const USER_TYPE = {
	SUPERUSER: 1,
	ADMIN: 2,
	OFFICER: 3,
	USER: 4,
};

export const LOGGED_USER_STATUS = {
	NewUser: 1,
	Active: 2,
	Inactive: 3,
	Locked: 4,
	PasswordReset: 5,
};

export const CHANGE_PASSWORD_STATUS = [LOGGED_USER_STATUS.NewUser, LOGGED_USER_STATUS.PasswordReset];
