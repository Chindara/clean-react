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
import { VALIDATION_ERROR_SHIPMENT_LOGISTICS_INVOICE } from 'constants/ValidationMessage';
import { CONTROL_SIZE } from 'constants/Common';
import MainCard from 'components/MainCard';
import moment from 'moment';

// ==============================|| PAYMENT FORM ||============================== //
export default function LogisticsInvoiceForm({ isFetching }) {
	const id = useId();

	const theme = useTheme();
	const { userId, companyId } = useAuth();
	const { logisticsInvoice, setLogisticsInvoice, error, setError, mode } = useNonPoShipment();

	const [beneficiaryChoices, setBeneficiaryChoices] = useState([]);
	const [categoryChoices, setCategoryChoices] = useState([]);
	const [paymentTypeChoices, setPaymentTypeChoices] = useState([]);
	const [currencyChoices, setCurrencyChoices] = useState([]);

	useEffect(() => {
		(async () => {
			try {
				const getBeneficiaries = LookupService.getBeneficiaries(companyId);
				const getCategories = LookupService.getShipmentCategory(companyId);
				const getPaymentTypes = LookupService.getPaymentTypes(companyId);
				const getCurrenciesV2 = LookupService.getCurrenciesV2(companyId);

				const [beneficiaries = [], categories = [], paymentTypes = [], currencies = []] = await Promise.all([getBeneficiaries, getCategories, getPaymentTypes, getCurrenciesV2]);

				setBeneficiaryChoices(beneficiaries?.data);
				setCategoryChoices(categories?.data);
				setPaymentTypeChoices(paymentTypes?.data);
				setCurrencyChoices(currencies?.data);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	const handleLogisticsInvoice = (event) => {
		const { name, value } = event.target;

		let errorList = error;
		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		// Add a validation check for the amount field
		if (name === 'amount' && parseFloat(value) <= 0) {
			errorList.push('validate-amount');
			setError(errorList);
			return; // Do not update the logisticsInvoice state if the amount is not greater than 0
		}

		setLogisticsInvoice({ ...logisticsInvoice, [name]: value });
	};

	const handleDatePickerChange = (property, value) => {
		let errorList = error;
		let errorIndex = errorList.indexOf(`validate-${property}`);
		if (errorIndex !== -1) errorList.splice(errorIndex, 1);
		setError(errorList);

		setLogisticsInvoice((logisticsInvoice) => ({ ...logisticsInvoice, [property]: moment(value).format('yyyy-MM-DD') }));
	};

	const handleAutoComplete = (property, value) => {
		setError((prevError) => prevError.filter((err) => err !== `validate-${property}`));
		setLogisticsInvoice((prevState) => ({
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
				<MainCard>
					<Grid container spacing={1} justifyContent='flex-start'>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<InputLabel required>Category</InputLabel>
								<Autocomplete
									multiple={false}
									id='category'
									options={categoryChoices}
									getOptionLabel={(option) => option.name}
									value={categoryChoices.find((option) => option.id === logisticsInvoice.category) || null}
									onChange={(event, value) => handleLogisticsInvoice({ target: { name: 'category', value: value ? value.id : null } })}
									renderInput={(params) => (
										<TextField
											{...params}
											variant='outlined'
											placeholder='Choose category'
											error={error.includes('validate-category')}
											helperText={error.includes('validate-category') ? VALIDATION_ERROR_SHIPMENT_LOGISTICS_INVOICE.categoryRequired : ''}
											disabled={mode === OPERATION_MODE.View}
										/>
									)}
								/>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<InputLabel required>Type</InputLabel>
								<Autocomplete
									multiple={false}
									id='type'
									options={paymentTypeChoices}
									getOptionLabel={(option) => option.name}
									value={paymentTypeChoices.find((option) => option.id === logisticsInvoice.type) || null}
									onChange={(event, value) => handleLogisticsInvoice({ target: { name: 'type', value: value ? value.id : null } })}
									renderInput={(params) => (
										<TextField
											{...params}
											variant='outlined'
											placeholder='Choose type'
											error={error.includes('validate-type')}
											helperText={error.includes('validate-type') ? VALIDATION_ERROR_SHIPMENT_LOGISTICS_INVOICE.typeRequired : ''}
											disabled={mode === OPERATION_MODE.View}
										/>
									)}
								/>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<InputLabel required>Currency</InputLabel>
								<Autocomplete
									//multiple={false}
									id='currency'
									options={currencyChoices}
									getOptionLabel={(option) => option}
									isOptionEqualToValue={(option, value) => option?.value === value?.value}
									value={logisticsInvoice.currency || null}
									onChange={(event, value) => handleAutoComplete('currency', value)}
									renderInput={(params) => (
										<TextField
											{...params}
											variant='outlined'
											placeholder='Choose Currency'
											error={error.includes('validate-currency')}
											helperText={error.includes('validate-currency') ? VALIDATION_ERROR_SHIPMENT_LOGISTICS_INVOICE.currencyRequired : ''}
											disabled={mode === OPERATION_MODE.View}
										/>
									)}
								/>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<InputLabel required>Amount</InputLabel>
								<TextField
									placeholder='Enter Amount'
									fullWidth
									size={CONTROL_SIZE}
									name='amount'
									value={logisticsInvoice.amount}
									onChange={handleLogisticsInvoice}
									type='number'
									error={error.includes('validate-amount')}
									helperText={error.includes('validate-amount') && VALIDATION_ERROR_SHIPMENT_LOGISTICS_INVOICE.amountRequired}
									disabled={mode === OPERATION_MODE.View}
									onKeyPress={(e) => {
										const charCode = e.which ? e.which : e.keyCode;
										if (charCode > 31 && (charCode < 48 || charCode > 57)) {
											e.preventDefault();
										}
									}}
								/>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<InputLabel>Beneficiary</InputLabel>
								<Autocomplete
									multiple={false}
									id='beneficiary'
									options={beneficiaryChoices}
									getOptionLabel={(option) => option.name}
									value={beneficiaryChoices.find((option) => option.id === logisticsInvoice.beneficiary) || null}
									onChange={(event, value) => handleLogisticsInvoice({ target: { name: 'beneficiary', value: value ? value.id : null } })}
									renderInput={(params) => (
										<TextField
											{...params}
											variant='outlined'
											placeholder='Choose beneficiary'
											error={error.includes('validate-beneficiary')}
											helperText={error.includes('validate-beneficiary') ? VALIDATION_ERROR_SHIPMENT_LOGISTICS_INVOICE.beneficiaryRequired : ''}
											disabled={mode === OPERATION_MODE.View}
										/>
									)}
								/>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<InputLabel required>Logistics Invoice Submitted Date to Finance</InputLabel>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DatePicker
										inputFormat='dd/MM/yyyy'
										value={logisticsInvoice.paymentSubmittedDate}
										onChange={(newValue) => handleDatePickerChange('paymentSubmittedDate', newValue)}
										disabled={mode === OPERATION_MODE.View}
										renderInput={(params) => (
											<TextField
												{...params}
												size={CONTROL_SIZE}
												error={error.includes('validate-paymentSubmittedDate')}
												helperText={error.includes('validate-paymentSubmittedDate') && VALIDATION_ERROR_SHIPMENT_LOGISTICS_INVOICE.paymentSubmittedDate}
											/>
										)}
									/>
								</LocalizationProvider>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<InputLabel required>logistics Invoice Due Date</InputLabel>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DatePicker
										inputFormat='dd/MM/yyyy'
										value={logisticsInvoice.paymentDueDate}
										onChange={(newValue) => handleDatePickerChange('paymentDueDate', newValue)}
										disabled={mode === OPERATION_MODE.View}
										renderInput={(params) => (
											<TextField
												{...params}
												size={CONTROL_SIZE}
												error={error.includes('validate-paymentDueDate')}
												helperText={error.includes('validate-paymentDueDate') && VALIDATION_ERROR_SHIPMENT_LOGISTICS_INVOICE.paymentDueDateRequired}
											/>
										)}
									/>
								</LocalizationProvider>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<InputLabel required>Logistics Invoice Date</InputLabel>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DatePicker
										inputFormat='dd/MM/yyyy'
										value={logisticsInvoice.invoiceDate}
										onChange={(newValue) => handleDatePickerChange('invoiceDate', newValue)}
										disabled={mode === OPERATION_MODE.View}
										renderInput={(params) => (
											<TextField
												{...params}
												size={CONTROL_SIZE}
												error={error.includes('validate-invoiceDate')}
												helperText={error.includes('validate-invoiceDate') && VALIDATION_ERROR_SHIPMENT_LOGISTICS_INVOICE.invoiceDateRequired}
											/>
										)}
									/>
								</LocalizationProvider>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<InputLabel>Container No</InputLabel>
								<TextField
									placeholder='Enter Container No'
									fullWidth
									size={CONTROL_SIZE}
									name='containerNo'
									value={logisticsInvoice.containerNo}
									onChange={handleLogisticsInvoice}
									disabled={mode === OPERATION_MODE.View}
								/>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<InputLabel required>Logistic Invoice Received Date</InputLabel>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DatePicker
										inputFormat='dd/MM/yyyy'
										value={logisticsInvoice.invoiceReceivedDate}
										onChange={(newValue) => handleDatePickerChange('invoiceReceivedDate', newValue)}
										disabled={mode === OPERATION_MODE.View}
										renderInput={(params) => (
											<TextField
												{...params}
												size={CONTROL_SIZE}
												error={error.includes('validate-invoiceReceivedDate')}
												helperText={error.includes('validate-invoiceReceivedDate') && VALIDATION_ERROR_SHIPMENT_LOGISTICS_INVOICE.invoiceReceivedDateRequired}
											/>
										)}
									/>
								</LocalizationProvider>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<InputLabel required>Logistic Payment Date</InputLabel>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DatePicker
										inputFormat='dd/MM/yyyy'
										value={logisticsInvoice.paymentDate}
										onChange={(newValue) => handleDatePickerChange('paymentDate', newValue)}
										disabled={mode === OPERATION_MODE.View}
										renderInput={(params) => (
											<TextField
												{...params}
												size={CONTROL_SIZE}
												error={error.includes('validate-paymentDate')}
												helperText={error.includes('validate-paymentDate') && VALIDATION_ERROR_SHIPMENT_LOGISTICS_INVOICE.paymentDateRequired}
											/>
										)}
									/>
								</LocalizationProvider>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<InputLabel required>Logistics Invoice Reference</InputLabel>
								<TextField
									placeholder='Enter the Logistics Invoice Reference'
									fullWidth
									size={CONTROL_SIZE}
									name='paymentReference'
									value={logisticsInvoice.paymentReference}
									onChange={handleLogisticsInvoice}
									error={error.includes('validate-paymentReference')}
									helperText={error.includes('validate-paymentReference') && VALIDATION_ERROR_SHIPMENT_LOGISTICS_INVOICE.paymentReferenceRequired}
									disabled={mode === OPERATION_MODE.View}
								/>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<InputLabel required>Remark</InputLabel>
								<TextField
									placeholder='Enter the Remark'
									fullWidth
									size={CONTROL_SIZE}
									name='remark'
									value={logisticsInvoice.remark}
									onChange={handleLogisticsInvoice}
									error={error.includes('validate-remark')}
									helperText={error.includes('validate-remark') && VALIDATION_ERROR_SHIPMENT_LOGISTICS_INVOICE.remarkRequired}
									disabled={mode === OPERATION_MODE.View}
								/>
							</Stack>
						</Grid>
					</Grid>
				</MainCard>
			)}
		</>
	);
}

LogisticsInvoiceForm.propTypes = {
	isFetching: PropTypes.bool,
};
