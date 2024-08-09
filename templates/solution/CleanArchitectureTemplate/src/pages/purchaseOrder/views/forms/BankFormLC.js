import React from 'react';

// MUI
import { Autocomplete, Box, CardHeader, Divider, Grid, InputLabel, Stack, TextField, CircularProgress, Typography } from '@mui/material';
import { Switch, MenuItem, FormControl, FormGroup, Select, FormHelperText, FormControlLabel } from '@mui/material';

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
import { PURCHASE_ORDER_BANK_ERROR, VALIDATION_ERROR } from 'constants/ValidationMessage';
import { CONTROL_SIZE } from 'constants/Common';
import { PURCHASE_ORDER_BANK_ALERT } from 'constants/AlertMessage';

export default function BankFormLC() {
	const { companyId } = useAuth();
	const { purchaseOrderBank, setPurchaseOrderBank, error, setError } = usePurchaseOrderBank();

	const {
		data: { bankOptions },
		isFetching,
	} = useQuery({
		queryKey: ['banks'],
		queryFn: () => getUserGroups(),
		refetchOnWindowFocus: false,
		initialData: { bankOptions: [] },
		onError: () => setAlertError(PURCHASE_ORDER_BANK_ALERT.Error.GetBanks),
	});

	const getUserGroups = async () => {
		const { data: banks = [] } = await PurchaseOrderBankService.getLookupBanks(companyId);

		const bankOptions = banks.reduce((accumulator, object) => [...accumulator, { label: object.name, value: object.id }], []);

		return { bankOptions };
	};

	const handleOnChange = (event) => {
		const { name, value } = event.target;

		setPurchaseOrderBank((prevState) => ({ ...prevState, LC: { ...prevState.LC, [name]: value } }));
	};

	const handleDatePickerChange = (property, value) => {
		let errorList = error;
		let errorIndex = errorList.indexOf(`validate-${property}`);
		if (errorIndex !== -1) errorList.splice(errorIndex, 1);
		setError(errorList);

		setPurchaseOrderBank((prevState) => ({ ...prevState, LC: { ...prevState.LC, [property]: value } }));
	};

	const handleAutoCompleteChange = (value) => {
		let errorList = [...error];
		let valueIndex = errorList.indexOf('validate-bank');

		setPurchaseOrderBank((prevState) => ({ ...prevState, LC: { ...prevState.LC, bank: value } }));
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
							value={bankOptions.find((option) => option?.value === purchaseOrderBank.LC.bank?.value) || null}
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
						<InputLabel required>Latest Date of Shipment</InputLabel>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								inputFormat='dd/MM/yyyy'
								value={purchaseOrderBank.LC.latestDateOfShipment}
								onChange={(newValue) => handleDatePickerChange('latestDateOfShipment', newValue)}
								renderInput={(params) => (
									<TextField
										{...params}
										size={CONTROL_SIZE}
										error={error.includes('validate-latestDateOfShipment')}
										helperText={error.includes('validate-latestDateOfShipment') && VALIDATION_ERROR.latestDateOfShipmentRequired}
									/>
								)}
							/>
						</LocalizationProvider>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel required>LC Expiry Date</InputLabel>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								inputFormat='dd/MM/yyyy'
								value={purchaseOrderBank.LC.lcExpiryDate}
								onChange={(newValue) => handleDatePickerChange('lcExpiryDate', newValue)}
								renderInput={(params) => (
									<TextField
										{...params}
										size={CONTROL_SIZE}
										error={error.includes('validate-lcExpiryDate')}
										helperText={error.includes('validate-lcExpiryDate') && VALIDATION_ERROR.lcExpiryDateRequired}
									/>
								)}
							/>
						</LocalizationProvider>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>LC Amount</InputLabel>
						<TextField
							name='lcAmount'
							type='number'
							placeholder='Enter LC Amount'
							fullWidth
							size={CONTROL_SIZE}
							value={purchaseOrderBank.LC.lcAmount || ''}
							onChange={handleOnChange}
						/>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>First Draft</InputLabel>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								inputFormat='dd/MM/yyyy'
								value={purchaseOrderBank.LC.firstDraft}
								onChange={(newValue) => handleDatePickerChange('firstDraft', newValue)}
								renderInput={(params) => <TextField {...params} />}
							/>
						</LocalizationProvider>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Second Draft</InputLabel>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								inputFormat='dd/MM/yyyy'
								value={purchaseOrderBank.LC.secondDraft}
								onChange={(newValue) => handleDatePickerChange('secondDraft', newValue)}
								renderInput={(params) => <TextField {...params} />}
							/>
						</LocalizationProvider>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Third Draft</InputLabel>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								inputFormat='dd/MM/yyyy'
								value={purchaseOrderBank.LC.thirdDraft}
								onChange={(newValue) => handleDatePickerChange('thirdDraft', newValue)}
								renderInput={(params) => <TextField {...params} />}
							/>
						</LocalizationProvider>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Final LC Received Date</InputLabel>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								inputFormat='dd/MM/yyyy'
								value={purchaseOrderBank.LC.finalLCReceivedDate}
								onChange={(newValue) => handleDatePickerChange('finalLCReceivedDate', newValue)}
								renderInput={(params) => <TextField {...params} />}
							/>
						</LocalizationProvider>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>LC Reference</InputLabel>
						<TextField name='lcReference' placeholder='Enter LC Reference' fullWidth size={CONTROL_SIZE} value={purchaseOrderBank.LC.lcReference || ''} onChange={handleOnChange} />
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Balance Amount</InputLabel>
						<TextField
							name='balanceAmount'
							type='number'
							placeholder='Enter Balance Amount'
							fullWidth
							size={CONTROL_SIZE}
							value={purchaseOrderBank.LC.balanceAmount || ''}
							onChange={handleOnChange}
						/>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel required>Balance Payment Method</InputLabel>
						<FormControl fullWidth>
							<Select
								variant='outlined'
								size={CONTROL_SIZE}
								name='balancePaymentMethod'
								value={purchaseOrderBank.LC.balancePaymentMethod}
								onChange={handleOnChange}
								error={error.includes('validate-balancePaymentMethod')}
								displayEmpty
							>
								<MenuItem disabled value='' key='placeholder'>
									<Typography variant='inherit' color='textSecondary'>
										Choose Balance Payment Method
									</Typography>
								</MenuItem>
								<MenuItem value={1}>TT</MenuItem>
								<MenuItem value={2}>DA</MenuItem>
								<MenuItem value={3}>DP</MenuItem>
								<MenuItem value={4}>Open A/C</MenuItem>
							</Select>
						</FormControl>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Requested from Bank</InputLabel>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								inputFormat='dd/MM/yyyy'
								value={purchaseOrderBank.LC.requestFromBank}
								onChange={(newValue) => handleDatePickerChange('requestFromBank', newValue)}
								renderInput={(params) => <TextField {...params} />}
							/>
						</LocalizationProvider>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Balance Paid Date</InputLabel>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								inputFormat='dd/MM/yyyy'
								value={purchaseOrderBank.LC.balancePaidDate}
								onChange={(newValue) => handleDatePickerChange('balancePaidDate', newValue)}
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
							value={purchaseOrderBank.LC.originalDocReceivedReference || ''}
							onChange={handleOnChange}
						/>
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
							value={purchaseOrderBank.LC.remark || ''}
							onChange={handleOnChange}
						/>
					</Stack>
				</Grid>
			</Grid>
		</>
	);
}
