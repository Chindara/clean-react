import React, { useEffect, useId, useState } from 'react';
import PropTypes from 'prop-types';

// MUI
import { Grid, TextField, InputLabel, Stack, Box, Skeleton, FormHelperText, MenuItem, Select, Typography, Autocomplete } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { useTheme } from '@mui/material/styles';
import { Divider, Button, FormControlLabel, Checkbox, FormGroup, RadioGroup, Radio } from '@mui/material';

// CONTEXTS
import { useNonPoShipment } from 'pages/nonPoShipment/contexts/NonPoShipmentContext';
import useAuth from 'hooks/useAuth';
import LookupService from 'services/LookupService';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { VALIDATION_ERROR_GUARANTEE } from 'constants/ValidationMessage';
import { CONTROL_SIZE } from 'constants/Common';
import MainCard from 'components/MainCard';
import { useDebouncedCallback } from 'use-debounce';
import ShipmentGuaranteeService from 'services/ShipmentGuaranteeService';
import { isEmpty } from 'validations/validation';
import { GUARANTEE_ALERT } from 'constants/AlertMessage';
import { setAlertError } from 'components/alert/Alert';

// ==============================|| guarantee FORM ||============================== //
export default function GuaranteeForm({ isFetching, handleSubmit, availability, setAvailability }) {
	const id = useId();

	const theme = useTheme();
	``;
	const { userId, companyId } = useAuth();
	const { guarantee, setGuarantee, error, setError, mode } = useNonPoShipment();

	const [bankChoices, setBankChoices] = useState([]);
	const [beneficiaryChoices, setBeneficiaryChoices] = useState([]);
	const [currencyChoices, setCurrencyChoices] = useState([]);

	const [availabilityLoader, setAvailabilityLoader] = useState(false);

	const debounced = useDebouncedCallback(async () => {
		await checkAvailability();
		setAvailabilityLoader(false);
	}, 1000);

	const checkAvailability = async () => {
		try {
			const { data: { record } = {} } = await ShipmentGuaranteeService.isExists(companyId, guarantee.poNo);

			setAvailability(record);
		} catch (error) {
			setAlertError(GUARANTEE_ALERT.Error.CheckAvailability);
		}
	};

	const debounceHandler = () => {
		setAvailabilityLoader(true);
		debounced();
	};

	useEffect(() => {
		(async () => {
			try {
				const getBanks = LookupService.getBanks(companyId);
				const getVendors = LookupService.getVendors(companyId);
				const getCurrenciesV2 = LookupService.getCurrenciesV2(companyId);

				const [beneficiaries = [], banks = [], currencies = []] = await Promise.all([getVendors, getBanks, getCurrenciesV2]);

				setBankChoices(banks?.data);
				setBeneficiaryChoices(beneficiaries?.data);
				setCurrencyChoices(currencies?.data);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	const handleGuarantee = (event) => {
		const { name, value } = event.target;

		let errorList = error;
		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		setGuarantee({ ...guarantee, [name]: value });
	};

	const onChange = (event) => {
		const { name, value } = event.target;

		if (name === 'poNo') {
			if (!isEmpty(value)) {
				debounceHandler();
			}
		}

		let errorList = error;
		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		setGuarantee({ ...guarantee, [name]: value });
	};

	const handleDatePickerChange = (property, value) => {
		let errorList = error;
		let errorIndex = errorList.indexOf(`validate-${property}`);
		if (errorIndex !== -1) errorList.splice(errorIndex, 1);
		setError(errorList);

		setGuarantee((guarantee) => ({ ...guarantee, [property]: value }));
	};

	const handleAutoComplete = (property, value) => {
		setError((prevError) => prevError.filter((err) => err !== `validate-${property}`));
		setGuarantee((prevState) => ({
			...prevState,
			[property]: value,
		}));
	};

	return (
		<>
			{isFetching ? (
				<Box px={1} mt={1}>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<Skeleton animation='wave' variant='rounded' width='100%' height={30} />
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<Skeleton animation='wave' variant='rounded' width='100%' height={30} />
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<Skeleton animation='wave' variant='rounded' width='100%' height={30} />
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<Skeleton animation='wave' variant='rounded' width='100%' height={30} />
							</Stack>
						</Grid>
					</Grid>
				</Box>
			) : (
				<Grid container spacing={3} justifyContent={'center'}>
					<Grid container item xs={11} spacing={1}>
						<Grid item xs={12} mt={1}>
							<Stack spacing={0.5}>
								<InputLabel id='demo-simple-select-standard-label'>Bank</InputLabel>
								<Autocomplete
									multiple={false}
									id='bank'
									options={bankChoices}
									getOptionLabel={(option) => option.name}
									value={bankChoices.find((option) => option.id === guarantee.bank) || null}
									onChange={(event, value) => onChange({ target: { name: 'bank', value: value ? value.id : null } })}
									renderInput={(params) => (
										<TextField
											{...params}
											variant='outlined'
											placeholder='Choose Approval'
											error={error.includes('validate-bank')}
											helperText={error.includes('validate-bank') ? VALIDATION_ERROR_GUARANTEE.bankRequired : ''}
											disabled={mode === OPERATION_MODE.View}
										/>
									)}
								/>
								<InputLabel required>Guarantee Type</InputLabel>
								<FormControl fullWidth>
									<Select
										variant='outlined'
										size={CONTROL_SIZE}
										name='type'
										value={guarantee.type || ''}
										onChange={(event) => handleGuarantee(event, 'type')}
										displayEmpty
										error={error.includes('validate-type')}
										disabled={mode === OPERATION_MODE.View}
									>
										<MenuItem disabled value='' key='placeholder'>
											<Typography variant='inherit' color='textSecondary'>
												Select Type
											</Typography>
										</MenuItem>
										<MenuItem value={1}>Bank Guarantee</MenuItem>
										<MenuItem value={2}>Shipping Guarantee</MenuItem>
										{error.includes('validate-type') && <FormHelperText error>{VALIDATION_ERROR_GUARANTEE.typeRequired}</FormHelperText>}
									</Select>
								</FormControl>
								<InputLabel required>Amount</InputLabel>
								<TextField
									placeholder='Enter Amount'
									fullWidth
									size={CONTROL_SIZE}
									name='amount'
									value={guarantee.amount}
									onChange={handleGuarantee}
									error={error.includes('validate-amount')}
									helperText={error.includes('validate-amount') && VALIDATION_ERROR_GUARANTEE.amountRequired}
									disabled={mode === OPERATION_MODE.View}
								/>
								<InputLabel required>Currency</InputLabel>
								<Autocomplete
									//multiple={false}
									id='currency'
									options={currencyChoices}
									getOptionLabel={(option) => option}
									isOptionEqualToValue={(option, value) => option?.value === value?.value}
									value={guarantee.currency || null}
									onChange={(event, value) => handleAutoComplete('currency', value)}
									renderInput={(params) => (
										<TextField
											{...params}
											variant='outlined'
											placeholder='Choose Currency'
											error={error.includes('validate-currency')}
											helperText={error.includes('validate-currency') ? VALIDATION_ERROR_GUARANTEE.currencyRequired : ''}
											disabled={mode === OPERATION_MODE.View}
										/>
									)}
								/>
								<InputLabel id='demo-simple-select-standard-label' required>
									Beneficiary
								</InputLabel>
								<Autocomplete
									multiple={false}
									id='beneficiary'
									options={beneficiaryChoices}
									getOptionLabel={(option) => option.name}
									value={beneficiaryChoices.find((option) => option.id === guarantee.beneficiary) || null}
									onChange={(event, value) => onChange({ target: { name: 'beneficiary', value: value ? value.id : null } })}
									renderInput={(params) => (
										<TextField
											{...params}
											variant='outlined'
											placeholder='Choose Beneficiary'
											error={error.includes('validate-beneficiary')}
											helperText={error.includes('validate-beneficiary') ? VALIDATION_ERROR_GUARANTEE.beneficiaryRequired : ''}
											disabled={mode === OPERATION_MODE.View}
										/>
									)}
								/>
								<InputLabel required>Issue Date</InputLabel>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DatePicker
										inputFormat='dd/MM/yyyy'
										value={guarantee.issueDate}
										onChange={(newValue) => handleDatePickerChange('issueDate', newValue)}
										disabled={mode === OPERATION_MODE.View}
										renderInput={(params) => (
											<TextField
												{...params}
												size={CONTROL_SIZE}
												error={error.includes('validate-issueDate')}
												helperText={error.includes('validate-issueDate') && VALIDATION_ERROR_GUARANTEE.issueDateRequired}
											/>
										)}
									/>
								</LocalizationProvider>
								<InputLabel required>Expiry Date</InputLabel>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DatePicker
										inputFormat='dd/MM/yyyy'
										value={guarantee.expiryDate}
										onChange={(newValue) => handleDatePickerChange('expiryDate', newValue)}
										disabled={mode === OPERATION_MODE.View}
										renderInput={(params) => (
											<TextField
												{...params}
												size={CONTROL_SIZE}
												error={error.includes('validate-expiryDate')}
												helperText={error.includes('validate-expiryDate') && VALIDATION_ERROR_GUARANTEE.expiryDateRequired}
											/>
										)}
									/>
								</LocalizationProvider>
								<InputLabel required>Extended Date</InputLabel>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DatePicker
										inputFormat='dd/MM/yyyy'
										value={guarantee.extendedDate}
										onChange={(newValue) => handleDatePickerChange('extendedDate', newValue)}
										disabled={mode === OPERATION_MODE.View}
										renderInput={(params) => (
											<TextField
												{...params}
												size={CONTROL_SIZE}
												error={error.includes('validate-extendedDate')}
												helperText={error.includes('validate-extendedDate') && VALIDATION_ERROR_GUARANTEE.extendedDateRequired}
											/>
										)}
									/>
								</LocalizationProvider>
								<InputLabel required>Remark</InputLabel>
								<TextField
									placeholder='Enter the Remark'
									fullWidth
									size={CONTROL_SIZE}
									name='remark'
									value={guarantee.remark}
									onChange={handleGuarantee}
									error={error.includes('validate-remark')}
									helperText={error.includes('validate-remark') && VALIDATION_ERROR_GUARANTEE.remarkRequired}
									disabled={mode === OPERATION_MODE.View}
								/>
								{mode !== OPERATION_MODE.Create && (
									<>
										<Stack spacing={1} direction='row'>
											<InputLabel required>Status</InputLabel>
										</Stack>
										<FormControl fullWidth>
											<Select
												variant='outlined'
												size={CONTROL_SIZE}
												name='status'
												value={guarantee.status}
												onChange={handleGuarantee}
												displayEmpty
												disabled={mode === OPERATION_MODE.View}
												//renderInput={(params) => <TextField {...params} placeholder='Select Status' />}
											>
												<MenuItem value={1}>Active</MenuItem>
												<MenuItem value={2}>Cancel</MenuItem>
											</Select>
										</FormControl>
									</>
								)}
							</Stack>
						</Grid>
					</Grid>
				</Grid>
			)}
		</>
	);
}

GuaranteeForm.propTypes = {
	isFetching: PropTypes.bool,
	handleSubmit: PropTypes.func,
	availability: PropTypes.bool,
	setAvailability: PropTypes.func,
};
