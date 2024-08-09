import { isEmpty } from 'validations/validation';

const validateBankForm = (paymentMethod, bankState, setError) => {
	const errorList = [];
	const properties = {
		DA: ['bank'],
		DP: ['bank'],
		LC: ['bank', 'latestDateOfShipment', 'lcExpiryDate'],
		OA: ['bank'],
		TT: ['bank', 'ttRequested'],
	};

	for (const property of properties[paymentMethod]) {
		if (!bankState[property] || isEmpty(bankState[property])) errorList.push(`validate-${property}`);
	}

	if (bankState['bank']?.value === 0) errorList.push('validate-bank');

	if (errorList.length) {
		setError(errorList);
		return false;
	}

	return true;
};

export { validateBankForm };
