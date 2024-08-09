import { stringRegex, emailRegex } from './regex';

const isEmpty = (value) => {
	return new RegExp(stringRegex).test(value);
};

const isNull = (value) => {
	console.log(value);

	return new RegExp('/^null$/').test(value);
};

const isEmailValid = (value) => {
	return new RegExp(emailRegex).test(value);
};

const isNumber = (value) => {
	return !isNaN(value);
};

export { isEmpty, isNull, isEmailValid, isNumber };
