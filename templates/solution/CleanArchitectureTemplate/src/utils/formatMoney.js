export const formatMoney = (currency, amount) => {
	const formattedAmount = Number(amount).toLocaleString('en-US', {
		style: 'decimal',
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
	});

	const formattedCurrency = currency ? currency + ' ' : '';

	return formattedCurrency + formattedAmount;
};
