import { toast } from 'react-toastify';

export function setAlertSuccess(message) {
	toast.success(message);
}

export function setAlertWarning(message) {
	toast.warn(message);
}

export function setAlertError(message) {
	toast.error(message);
}

// export function setAlertSuccess(message) {
// 	toast.success(message, {
// 		autoClose: false,
// 	});
// }
