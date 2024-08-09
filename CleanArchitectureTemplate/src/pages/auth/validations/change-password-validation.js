import { isEmpty } from 'validations/validation';

const validateChangePasswordForm = (userState, level, setError) => {
	const errorList = [];
	const properties = ['newPassword', 'confirmPassword'];
	const unSecuredLevels = ['Poor', 'Weak'];

	for (const property of properties) if (isEmpty(userState[property])) errorList.push(`validate-${property}`);

	if (unSecuredLevels.includes(level?.label)) errorList.push(`validate-newPassword-level`);

	if (!!(userState?.newPassword && userState?.newPassword?.length > 0) && !!(userState?.confirmPassword && userState?.confirmPassword?.length > 0)) {
		if (userState.newPassword !== userState.confirmPassword) errorList.push('validate-confirmPassword-match');
	}

	if (errorList.length) {
		setError(errorList);
		return false;
	}

	return true;
};

export { validateChangePasswordForm };
