import React from 'react';

// MUI
import { Autocomplete, Box, Grid, InputLabel, Stack, TextField, CircularProgress } from '@mui/material';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// THIRD-PARTY
import { useQuery } from '@tanstack/react-query';

// CONTEXTS
import { usePurchaseOrderBank } from 'pages/purchaseOrder/contexts/BankContext';

// HOOKS
import useAuth from 'hooks/useAuth';

// SERVICES
import PurchaseOrderBankService from 'services/PurchaseOrderBankService';

// ALERTS
import { setAlertError } from 'components/alert/Alert';

// CONSTANTS
import { PURCHASE_ORDER_BANK_ERROR } from 'constants/ValidationMessage';
import { CONTROL_SIZE } from 'constants/Common';
import { PURCHASE_ORDER_BANK_ALERT } from 'constants/AlertMessage';

export default function BankFormDP() {
	const { companyId } = useAuth();
	const { purchaseOrderBank, setPurchaseOrderBank, error, setError } = usePurchaseOrderBank();

	const {
		data: { bankOptions },
		isFetching,
	} = useQuery({
		queryKey: ['banks'],
		queryFn: () => getBanks(),
		refetchOnWindowFocus: false,
		initialData: { bankOptions: [] },
		onError: () => setAlertError(PURCHASE_ORDER_BANK_ALERT.Error.GetBanks),
	});

	const getBanks = async () => {
		const { data: banks = [] } = await PurchaseOrderBankService.getLookupBanks(companyId);
		const bankOptions = banks.reduce((accumulator, object) => [...accumulator, { label: object.name, value: object.id }], []);
		return { bankOptions };
	};

	const handleOnChange = (event) => {
		const { name, value } = event.target;

		if (name === 'endorsedAmount') {
			console.log(purchaseOrderBank.purchaseAmount);
			const balanceAmount = purchaseOrderBank.purchaseAmount - value;
			console.log(balanceAmount);
			setPurchaseOrderBank((prevState) => ({ ...prevState, DP: { ...prevState.DP, balanceAmount: balanceAmount } }));
		}

		setPurchaseOrderBank((prevState) => ({ ...prevState, DP: { ...prevState.DP, [name]: value } }));
	};

	const handleDatePickerChange = (property, value) => {
		let errorList = error;
		let errorIndex = errorList.indexOf(`validate-${property}`);
		if (errorIndex !== -1) errorList.splice(errorIndex, 1);
		setError(errorList);

		setPurchaseOrderBank((prevState) => ({ ...prevState, DP: { ...prevState.DP, [property]: value } }));
	};

	const handleAutoCompleteChange = (value) => {
		let errorList = [...error];
		let valueIndex = errorList.indexOf('validate-bank');

		setPurchaseOrderBank((prevState) => ({ ...prevState, DP: { ...prevState.DP, bank: value } }));
		if (valueIndex !== -1) errorList.splice(valueIndex, 1) && setError(errorList);
	};

	return (
		<>
			<Grid container spacing={1} justifyContent='flex-start'>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Purchase Order No</InputLabel>
						<TextField name='poNo' disabled placeholder='Enter Purchase Order Number' fullWidth size={CONTROL_SIZE} value={purchaseOrderBank.poNo} />
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Payment Method</InputLabel>
						<TextField name='paymentMethod' disabled placeholder='Enter Payment Method' fullWidth size={CONTROL_SIZE} value={purchaseOrderBank.paymentMethod} />
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel required>Bank</InputLabel>
						<Autocomplete
							id='banks'
							fullWidth
							loading={isFetching}
							options={bankOptions}
							getOptionLabel={(option) => option.label}
							isOptionEqualToValue={(option, value) => option.value === value.value}
							autoHighlight
							filterSelectedOptions
							value={bankOptions.find((option) => option?.value === purchaseOrderBank.DP.bank?.value) || null}
							noOptionsText={'No Results'}
							clearOnBlur
							onChange={(event, value) => handleAutoCompleteChange(value)}
							renderInput={(params) => (
								<TextField
									{...params}
									placeholder='Select Bank'
									fullWidth
									InputProps={{
										...params.InputProps,
										endAdornment: (
											<>
												{isFetching && <CircularProgress color='primary' size={16} />}
												{params.InputProps.endAdornment}
											</>
										),
									}}
									error={error.includes('validate-bank')}
									helperText={error.includes('validate-bank') && PURCHASE_ORDER_BANK_ERROR.bankRequired}
								/>
							)}
						/>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Endorsed Amount</InputLabel>
						<TextField
							name='endorsedAmount'
							placeholder='Enter Endorsed Amount'
							fullWidth
							size={CONTROL_SIZE}
							value={purchaseOrderBank.DP.endorsedAmount || ''}
							onChange={handleOnChange}
						/>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Submitted to Bank</InputLabel>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								inputFormat='dd/MM/yyyy'
								value={purchaseOrderBank.DP.submittedToBank}
								onChange={(newValue) => handleDatePickerChange('submittedToBank', newValue)}
								renderInput={(params) => <TextField {...params} />}
							/>
						</LocalizationProvider>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Endorsement Received Date</InputLabel>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								inputFormat='dd/MM/yyyy'
								value={purchaseOrderBank.DP.endorsementReceivedDate}
								onChange={(newValue) => handleDatePickerChange('endorsementReceivedDate', newValue)}
								renderInput={(params) => <TextField {...params} />}
							/>
						</LocalizationProvider>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Bank Endorsement Reference</InputLabel>
						<TextField
							name='bankEndorsementReference'
							placeholder='Enter Bank Endorsement Reference'
							fullWidth
							size={CONTROL_SIZE}
							value={purchaseOrderBank.DP.bankEndorsementReference || ''}
							onChange={handleOnChange}
						/>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Balance Amount</InputLabel>
						<TextField
							name='balanceAmount'
							placeholder='Enter Balance Amount'
							fullWidth
							size={CONTROL_SIZE}
							value={purchaseOrderBank.DP.balanceAmount || ''}
							onChange={handleOnChange}
							disabled
						/>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Original Doc Received Date</InputLabel>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								inputFormat='dd/MM/yyyy'
								value={purchaseOrderBank.DP.originalDocReceivedDate}
								onChange={(newValue) => handleDatePickerChange('originalDocReceivedDate', newValue)}
								renderInput={(params) => <TextField {...params} />}
							/>
						</LocalizationProvider>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Original Doc Received Reference</InputLabel>
						<TextField
							name='originalDocReceivedReference'
							placeholder='Enter Original Doc Received Reference'
							fullWidth
							size={CONTROL_SIZE}
							value={purchaseOrderBank.DP.originalDocReceivedReference || ''}
							onChange={handleOnChange}
						/>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Copy Docs Submitted to Finance</InputLabel>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								inputFormat='dd/MM/yyyy'
								value={purchaseOrderBank.DP.copyDocsSubmittedToFinance}
								onChange={(newValue) => handleDatePickerChange('copyDocsSubmittedToFinance', newValue)}
								renderInput={(params) => <TextField {...params} />}
							/>
						</LocalizationProvider>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Remark</InputLabel>
						<TextField
							name='remark'
							multiline
							rows={3}
							placeholder='Enter Remark'
							fullWidth
							size={CONTROL_SIZE}
							value={purchaseOrderBank.DP.remark || ''}
							onChange={handleOnChange}
						/>
					</Stack>
				</Grid>
			</Grid>
		</>
	);
}
