const emailRegex =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const stringRegex = /^\s*$/;

const avatarRegex = /\.(png|jpe?g)$/i;

const passwordCriteria = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[\S]{8,256}$/;

const isEmpty = (value) => {
	return new RegExp(stringRegex).test(value);
};

const contactNumberRegex = /^\+?[0-9]{1,3}?[-. ]?\(?([0-9]{1,})\)?[-. ]?([0-9]{1,})[-. ]?([0-9]{1,})$/;

const isValidEmail = (value) => {
	return new RegExp(emailRegex).test(value);
};

const isValidContactNumber = (value) => {
	return new RegExp(contactNumberRegex).test(value);
};
export {
	emailRegex,
	stringRegex,
	avatarRegex,
	passwordCriteria,
	isEmpty,
	isValidContactNumber,
	isValidEmail,
};
