import React, { useEffect, useState } from 'react';

import { useTheme } from '@mui/material/styles';
import {
	Grid,
	Switch,
	TextField,
	InputLabel,
	Stack,
	Button,
	Typography,
	MenuItem,
	FormControl,
	FormGroup,
	Select,
	FormHelperText,
	FormControlLabel,
	CircularProgress,
	Autocomplete,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import PropTypes from 'prop-types';
import { usePurchaseOrder } from '../../contexts/PurchaseOrderContext';
import { VALIDATION_ERROR } from 'constants/ValidationMessage';
import LookupService from 'services/LookupService';
import PurchaseOrderService from 'services/PurchaseOrderService';
import { CONTROL_SIZE } from 'constants/Common';
import useAuth from 'hooks/useAuth';
import moment from 'moment';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { OPERATION_MODE } from 'constants/Types';
import { styled } from '@mui/material/styles';
import { useDebouncedCallback } from 'use-debounce';
import { setAlertError } from 'components/alert/Alert';
import { PURCHASE_ORDER_ALERT } from 'constants/AlertMessage';
import { isEmpty } from 'validations/validation';
import { property } from 'lodash';

const IOSSwitch = styled((props) => <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />)(({ theme }) => ({
	width: 42,
	height: 26,
	padding: 0,
	'& .MuiSwitch-switchBase': {
		padding: 0,
		margin: 2,
		transitionDuration: '300ms',
		'&.Mui-checked': {
			transform: 'translateX(16px)',
			color: '#fff',
			'& + .MuiSwitch-track': {
				backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
				opacity: 1,
				border: 0,
			},
			'&.Mui-disabled + .MuiSwitch-track': {
				opacity: 0.5,
			},
		},
		'&.Mui-focusVisible .MuiSwitch-thumb': {
			color: '#33cf4d',
			border: '6px solid #fff',
		},
		'&.Mui-disabled .MuiSwitch-thumb': {
			color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
		},
		'&.Mui-disabled + .MuiSwitch-track': {
			opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
		},
	},
	'& .MuiSwitch-thumb': {
		boxSizing: 'border-box',
		width: 22,
		height: 22,
	},
	'& .MuiSwitch-track': {
		borderRadius: 26 / 2,
		backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
		opacity: 1,
		transition: theme.transitions.create(['background-color'], {
			duration: 500,
		}),
	},
}));

export default function PurchaseOrderForm({ handleSubmit, availability, setAvailability }) {
	const theme = useTheme();
	const { userId, companyId } = useAuth();

	const { purchaseOrder, setPurchaseOrder, error, setError, mode } = usePurchaseOrder();
	const [countryChoices, setCountryChoices] = useState([]);
	const [currencyChoices, setCurrencyChoices] = useState([]);
	const [incoTermChoices, setIncoTermChoices] = useState([]);
	const [entityChoices, setEntityChoices] = useState([]);
	const [vendorChoices, setVendorChoices] = useState([]);
	const [userChoices, setUserChoices] = useState([]);
	const [approvalChoices, setApprovalChoices] = useState([]);
	const [natureOfPurchaseChoices, setNatureOfPurchase] = useState([]);
	const [subPaymentMethodChoices, setSubPaymentMethod] = useState([]);
	//const [purchaseNoAvailable, setPurchaseNoAvailable] = useState(false);

	const [availabilityLoader, setAvailabilityLoader] = useState(false);

	const debounced = useDebouncedCallback(async () => {
		await checkAvailability();
		setAvailabilityLoader(false);
	}, 1000);

	const checkAvailability = async () => {
		try {
			const { data: { record } = {} } = await PurchaseOrderService.isExists(companyId, purchaseOrder.poNo);

			setAvailability(record);
		} catch (error) {
			setAlertError(PURCHASE_ORDER_ALERT.Error.CheckAvailability);
		}
	};

	const debounceHandler = () => {
		setAvailabilityLoader(true);
		debounced();
	};

	useEffect(() => {
		(async () => {
			try {
				const getCountriesV2 = LookupService.getCountriesV2();
				const getCurrenciesV2 = LookupService.getCurrenciesV2();
				const getIncoTerms = LookupService.getIncoTerms(companyId);
				const getEntities = LookupService.getEntities(companyId);
				const getVendors = LookupService.getVendors(companyId);
				const getUsers = LookupService.getUsers(companyId);
				const getApprovals = LookupService.getApprovals(companyId);
				const getNatureOfPurchase = LookupService.getNatureOfPurchase(companyId);
				const getSubPaymentMethod = LookupService.getSubPaymentMethod(companyId);

				const [countries = [], currencies = [], incoTerms = [], entities = [], vendors = [], users = [], approvals = [], natureOfPurchase = [], subPaymentMethod = []] =
					await Promise.all([getCountriesV2, getCurrenciesV2, getIncoTerms, getEntities, getVendors, getUsers, getApprovals, getNatureOfPurchase, getSubPaymentMethod]);

				setCountryChoices(countries?.data);
				setCurrencyChoices(currencies?.data);
				setIncoTermChoices(incoTerms?.data);
				setEntityChoices(entities?.data);
				setVendorChoices(vendors?.data);
				setUserChoices(users?.data);
				setApprovalChoices(approvals?.data);
				setNatureOfPurchase(natureOfPurchase?.data);
				setSubPaymentMethod(subPaymentMethod?.data);
				//console.log(subPaymentMethod);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	const onChange = (event) => {
		console.log(event.target);
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

		setPurchaseOrder({ ...purchaseOrder, [name]: value });
	};

	const handleDatePickerChange = (property, value) => {
		let errorList = error;
		let errorIndex = errorList.indexOf(`validate-${property}`);
		if (errorIndex !== -1) errorList.splice(errorIndex, 1);
		setError(errorList);

		setPurchaseOrder((prevState) => ({ ...prevState, [property]: value }));
	};

	const onCheck = (event) => {
		const { name, checked } = event.target;
		let errorList = error;

		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		setPurchaseOrder({ ...purchaseOrder, [name]: checked });
	};

	const handleAutoComplete = (property, value) => {
		setError((prevError) => prevError.filter((err) => err !== `validate-${property}`));
		setPurchaseOrder((prevState) => ({
			...prevState,
			[property]: value,
		}));
	};

	console.log('purchaseOrder', purchaseOrder);

	return (
		<>
			<Grid container spacing={2} justifyContent='flex-end'>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<Stack direction='row' spacing={1}>
								<InputLabel required>Purchase Order Number</InputLabel>
								{availabilityLoader && (
									<Typography variant='caption' color='primary' sx={{ fontStyle: 'italic' }}>
										{PURCHASE_ORDER_ALERT.Info.CheckingPurchaseNo}
									</Typography>
								)}
							</Stack>
							<TextField
								name='poNo'
								value={purchaseOrder.poNo}
								placeholder='Enter Purchase Order Number'
								fullWidth
								size={CONTROL_SIZE}
								onChange={onChange}
								error={error.includes('validate-poNo') || availability}
								helperText={error.includes('validate-poNo') && VALIDATION_ERROR.poNoRequired}
								InputProps={{
									endAdornment: (
										<>
											{availabilityLoader && (
												<Grid pt={0.49}>
													<CircularProgress color='primary' size={16} />
												</Grid>
											)}
										</>
									),
								}}
							/>
							{availability && (
								<Typography variant='caption' color='error'>
									{VALIDATION_ERROR.poNoExists}
								</Typography>
							)}
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Purchase Order Date</InputLabel>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									inputFormat='dd/MM/yyyy'
									value={purchaseOrder.poDate}
									onChange={(newValue) => handleDatePickerChange('poDate', newValue)}
									renderInput={(params) => (
										<TextField
											{...params}
											size={CONTROL_SIZE}
											error={error.includes('validate-poDate')}
											helperText={error.includes('validate-poDate') && VALIDATION_ERROR.poDateRequired}
										/>
									)}
								/>
							</LocalizationProvider>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid container item xs={12} sm={6}>
						<Grid item xs={12} sm={12}>
							<Stack spacing={0.5}>
								<InputLabel required>Date of Delivery</InputLabel>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DatePicker
										inputFormat='dd/MM/yyyy'
										value={purchaseOrder.dateOfDelivery}
										onChange={(newValue) => handleDatePickerChange('dateOfDelivery', newValue)}
										renderInput={(params) => (
											<TextField
												{...params}
												size={CONTROL_SIZE}
												error={error.includes('validate-dateOfDelivery')}
												helperText={error.includes('validate-dateOfDelivery') && VALIDATION_ERROR.dateOfDeliveryRequired}
											/>
										)}
									/>
								</LocalizationProvider>
							</Stack>
						</Grid>
						<Grid item xs={12} sm={12}>
							<Stack spacing={0.5} marginTop={2}>
								<InputLabel required>PI Number</InputLabel>
								<TextField
									placeholder='Enter PI Number'
									fullWidth
									size={CONTROL_SIZE}
									name='piNo'
									value={purchaseOrder.piNo}
									onChange={onChange}
									error={error.includes('validate-piNo')}
									helperText={error.includes('validate-piNo') && VALIDATION_ERROR.piNoRequired}
								/>
							</Stack>
						</Grid>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Description</InputLabel>
							<TextField
								placeholder='Enter Description'
								fullWidth
								size={CONTROL_SIZE}
								multiline
								rows={4}
								name='description'
								value={purchaseOrder.description}
								onChange={onChange}
								error={error.includes('validate-description')}
								helperText={error.includes('validate-description') && VALIDATION_ERROR.descriptionRequired}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Entity</InputLabel>
							<Autocomplete
								multiple={false}
								id='entity'
								options={entityChoices}
								getOptionLabel={(option) => option.name}
								value={entityChoices.find((option) => option.id === purchaseOrder.entity) || null}
								onChange={(event, value) => onChange({ target: { name: 'entity', value: value ? value.id : null } })}
								renderInput={(params) => (
									<TextField
										{...params}
										variant='outlined'
										placeholder='Choose entity'
										error={error.includes('validate-entity')}
										helperText={error.includes('validate-entity') ? VALIDATION_ERROR.entityRequired : ''}
										disabled={mode === OPERATION_MODE.View}
									/>
								)}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Nature of Purchase</InputLabel>
							<Autocomplete
								multiple={false}
								id='natureOfPurchase'
								options={natureOfPurchaseChoices}
								getOptionLabel={(option) => option.name}
								value={natureOfPurchaseChoices.find((option) => option.id === purchaseOrder.natureOfPurchase) || null}
								onChange={(event, value) => onChange({ target: { name: 'natureOfPurchase', value: value ? value.id : null } })}
								renderInput={(params) => (
									<TextField
										{...params}
										variant='outlined'
										placeholder='Choose natureOfPurchase'
										error={error.includes('validate-natureOfPurchase')}
										helperText={error.includes('validate-natureOfPurchase') ? VALIDATION_ERROR.natureOfPurchaseRequired : ''}
										disabled={mode === OPERATION_MODE.View}
									/>
								)}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Vendor</InputLabel>
							<Autocomplete
								multiple={false} // Assuming you're selecting only one purchase order number
								id='vendor'
								options={vendorChoices}
								getOptionLabel={(option) => option.name}
								value={vendorChoices.find((option) => option.id === purchaseOrder.vendor) || null}
								onChange={(event, value) => onChange({ target: { name: 'vendor', value: value ? value.id : null } })}
								renderInput={(params) => (
									<TextField
										{...params}
										variant='outlined'
										placeholder='Choose Vendor'
										error={error.includes('validate-vendor')}
										helperText={error.includes('validate-vendor') ? VALIDATION_ERROR.vendorRequired : ''}
										disabled={mode === OPERATION_MODE.View}
									/>
								)}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Country</InputLabel>
							<Autocomplete
								id='country'
								options={countryChoices}
								getOptionLabel={(option) => option}
								isOptionEqualToValue={(option, value) => option?.value === value?.value}
								value={purchaseOrder.country || null}
								onChange={(event, value) => handleAutoComplete('country', value)}
								renderInput={(params) => (
									<TextField
										{...params}
										variant='outlined'
										placeholder='Choose Country'
										error={error.includes('validate-country')}
										helperText={error.includes('validate-country') ? VALIDATION_ERROR.countryRequired : ''}
										disabled={mode === OPERATION_MODE.View}
									/>
								)}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Currency</InputLabel>
							<Autocomplete
								//multiple={false}
								id='currency'
								options={currencyChoices}
								getOptionLabel={(option) => option}
								isOptionEqualToValue={(option, value) => option?.value === value?.value}
								value={purchaseOrder.currency || null}
								onChange={(event, value) => handleAutoComplete('currency', value)}
								renderInput={(params) => (
									<TextField
										{...params}
										variant='outlined'
										placeholder='Choose Currency'
										error={error.includes('validate-currency')}
										helperText={error.includes('validate-currency') ? VALIDATION_ERROR.currencyRequired : ''}
										disabled={mode === OPERATION_MODE.View}
									/>
								)}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Amount</InputLabel>
							<TextField
								placeholder='Enter Amount'
								fullWidth
								size={CONTROL_SIZE}
								name='amount'
								type='number'
								inputProps={{ min: 0 }}
								value={purchaseOrder.amount}
								onChange={onChange}
								error={error.includes('validate-amount') || error.includes('validate-amount-format')}
								helperText={(error.includes('validate-amount') && VALIDATION_ERROR.amountRequired) || (error.includes('validate-amount-format') && VALIDATION_ERROR.amountFormat)}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Quantity</InputLabel>
							<TextField
								placeholder='Enter Quantity'
								fullWidth
								size={CONTROL_SIZE}
								name='quantity'
								type='text'
								value={purchaseOrder.quantity}
								onChange={onChange}
								// error={error.includes('validate-quantity') || error.includes('validate-quantity-format')}
								// helperText={
								// 	(error.includes('validate-quantity') && VALIDATION_ERROR.quantityRequired) || (error.includes('validate-quantity-format') && VALIDATION_ERROR.quantityFormat)
								// }
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Volume</InputLabel>
							<TextField
								placeholder='Enter Volume'
								fullWidth
								size={CONTROL_SIZE}
								name='volume'
								type='text'
								inputProps={10}
								value={purchaseOrder.volume}
								onChange={onChange}
								//error={error.includes('validate-volume') || error.includes('validate-volume-format')}
								//helperText={(error.includes('validate-volume') && VALIDATION_ERROR.volumeRequired) || (error.includes('validate-volume-format') && VALIDATION_ERROR.volumeFormat)}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Buyer</InputLabel>
							<FormControl fullWidth>
								<Select
									variant='outlined'
									size={CONTROL_SIZE}
									name='buyer'
									value={purchaseOrder.buyer || ''}
									onChange={onChange}
									error={error.includes('validate-buyer')}
									displayEmpty
								>
									<MenuItem disabled value='' key='placeholder'>
										<Typography variant='inherit' color='textSecondary'>
											Choose Buyer
										</Typography>
									</MenuItem>
									{userChoices.map(({ name, id }) => (
										<MenuItem key={id} value={id}>
											{name}
										</MenuItem>
									))}
								</Select>
								{error.includes('validate-buyer') && <FormHelperText error>{VALIDATION_ERROR.buyerRequired}</FormHelperText>}
							</FormControl>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>User</InputLabel>
							<FormControl fullWidth>
								<Select
									variant='outlined'
									size={CONTROL_SIZE}
									name='user'
									value={purchaseOrder.user || ''}
									onChange={onChange}
									error={error.includes('validate-user')}
									displayEmpty
								>
									<MenuItem disabled value='' key='placeholder'>
										<Typography variant='inherit' color='textSecondary'>
											Choose User
										</Typography>
									</MenuItem>
									{userChoices.map(({ name, id }) => (
										<MenuItem key={id} value={id}>
											{name}
										</MenuItem>
									))}
								</Select>
								{error.includes('validate-user') && <FormHelperText error>{VALIDATION_ERROR.userRequired}</FormHelperText>}
							</FormControl>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>License Approval</InputLabel>
							<FormGroup>
								<FormControlLabel
									size={CONTROL_SIZE}
									name='license'
									onChange={onCheck}
									checked={purchaseOrder.license}
									control={<IOSSwitch />}
									disabled={mode === OPERATION_MODE.View}
								/>
							</FormGroup>
						</Stack>
					</Grid>
				</Grid>
				{purchaseOrder.license && (
					<>
						<Grid container item spacing={1}>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel required>Approval</InputLabel>
									<Autocomplete
										multiple={false}
										id='approval'
										options={approvalChoices}
										getOptionLabel={(option) => option.name}
										value={approvalChoices.find((option) => option.id === purchaseOrder.approval) || null}
										onChange={(event, value) => onChange({ target: { name: 'approval', value: value ? value.id : null } })}
										renderInput={(params) => (
											<TextField
												{...params}
												variant='outlined'
												placeholder='Choose Approval'
												error={error.includes('validate-approval')}
												helperText={error.includes('validate-approval') ? VALIDATION_ERROR.approvalRequired : ''}
												disabled={mode === OPERATION_MODE.View}
											/>
										)}
									/>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Approval Date</InputLabel>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DatePicker
											inputFormat='dd/MM/yyyy'
											value={purchaseOrder.approvalDate}
											onChange={(newValue) => handleDatePickerChange('approvalDate', newValue)}
											renderInput={(params) => (
												<TextField
													{...params}
													size={CONTROL_SIZE}
													error={error.includes('validate-approvalDate')}
													helperText={error.includes('validate-approvalDate') && VALIDATION_ERROR.approvalDateRequired}
												/>
											)}
										/>
									</LocalizationProvider>
								</Stack>
							</Grid>
						</Grid>
						<Grid container item spacing={1}>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Approval Reference</InputLabel>
									<TextField
										name='approvalReference'
										value={purchaseOrder.approvalReference}
										placeholder='Enter Approval Reference'
										fullWidth
										size={CONTROL_SIZE}
										onChange={onChange}
										error={error.includes('validate-approvalReference')}
										//helperText={error.includes('validate-approvalReference') && VALIDATION_ERROR.approvalReferenceRequired}
									/>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Approval Expiry Date</InputLabel>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DatePicker
											inputFormat='dd/MM/yyyy'
											value={purchaseOrder.approvalExpiry}
											onChange={(newValue) => handleDatePickerChange('approvalExpiry', newValue)}
											renderInput={(params) => (
												<TextField
													{...params}
													size={CONTROL_SIZE}
													error={error.includes('validate-approvalExpiry')}
													//helperText={error.includes('validate-approvalExpiry') && VALIDATION_ERROR.approvalExpiryRequired}
												/>
											)}
										/>
									</LocalizationProvider>
								</Stack>
							</Grid>
						</Grid>
					</>
				)}
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Payment Method</InputLabel>
							<Autocomplete
								multiple={false}
								id='paymentMethod'
								options={subPaymentMethodChoices}
								getOptionLabel={(option) => option.name}
								value={subPaymentMethodChoices.find((option) => option.id === purchaseOrder.paymentMethod) || null}
								onChange={(event, value) => onChange({ target: { name: 'paymentMethod', value: value ? value.id : null } })}
								renderInput={(params) => (
									<TextField
										{...params}
										variant='outlined'
										placeholder='Choose payment Method'
										error={error.includes('validate-paymentMethod')}
										helperText={error.includes('validate-paymentMethod') ? VALIDATION_ERROR.paymentMethodRequired : ''}
										disabled={mode === OPERATION_MODE.View}
									/>
								)}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Transport Mode</InputLabel>
							<FormControl fullWidth>
								<Select
									variant='outlined'
									size={CONTROL_SIZE}
									name='transportMode'
									value={purchaseOrder.transportMode || ''}
									onChange={onChange}
									error={error.includes('validate-transportMode')}
									displayEmpty
								>
									<MenuItem disabled value='' key='placeholder'>
										<Typography variant='inherit' color='textSecondary'>
											Choose Transport Mode
										</Typography>
									</MenuItem>
									<MenuItem value={1}>Air</MenuItem>
									<MenuItem value={2}>Sea</MenuItem>
									<MenuItem value={3}>Courier</MenuItem>
								</Select>
								{error.includes('validate-transportMode') && <FormHelperText error>{VALIDATION_ERROR.transportModeRequired}</FormHelperText>}
							</FormControl>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>ETD</InputLabel>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									inputFormat='dd/MM/yyyy'
									value={purchaseOrder.eda}
									onChange={(newValue) => handleDatePickerChange('eda', newValue)}
									renderInput={(params) => (
										<TextField {...params} size={CONTROL_SIZE} error={error.includes('validate-eda')} helperText={error.includes('validate-eda') && VALIDATION_ERROR.edaRequired} />
									)}
									disabled={mode !== OPERATION_MODE.Create && purchaseOrder.edaHasValue}
								/>
							</LocalizationProvider>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Inco Term</InputLabel>
							<Autocomplete
								multiple={false} // Assuming you're selecting only one purchase order number
								id='incoTerm'
								options={incoTermChoices}
								getOptionLabel={(option) => option.name}
								value={incoTermChoices.find((option) => option.id === purchaseOrder.incoTerm) || null}
								onChange={(event, value) => onChange({ target: { name: 'incoTerm', value: value ? value.id : null } })}
								renderInput={(params) => (
									<TextField
										{...params}
										variant='outlined'
										placeholder='Choose IncoTerm'
										error={error.includes('validate-incoTerm')}
										helperText={error.includes('validate-license') ? VALIDATION_ERROR.incoTermRequired : ''}
										disabled={mode === OPERATION_MODE.View}
									/>
								)}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>ETA</InputLabel>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									inputFormat='dd/MM/yyyy'
									value={purchaseOrder.eta}
									onChange={(newValue) => handleDatePickerChange('eta', newValue)}
									renderInput={(params) => (
										<TextField {...params} size={CONTROL_SIZE} error={error.includes('validate-eta')} helperText={error.includes('validate-eta') && VALIDATION_ERROR.etaRequired} />
									)}
									disabled={mode !== OPERATION_MODE.Create && purchaseOrder.etaHasValue}
								/>
							</LocalizationProvider>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Revised ETA</InputLabel>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									inputFormat='dd/MM/yyyy'
									value={purchaseOrder.revisedETA}
									onChange={(newValue) => handleDatePickerChange('revisedETA', newValue)}
									renderInput={(params) => (
										<TextField
											{...params}
											size={CONTROL_SIZE}
											error={error.includes('validate-revisedETA')}
											helperText={error.includes('validate-revisedETA') && VALIDATION_ERROR.revisedETARequired}
										/>
									)}
									disabled={mode !== OPERATION_MODE.Create && purchaseOrder.revisedETAHasValue}
								/>
							</LocalizationProvider>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>GRN</InputLabel>
							<FormControl fullWidth>
								<Select variant='outlined' size={CONTROL_SIZE} name='grn' value={purchaseOrder.grn || ''} onChange={onChange} displayEmpty>
									<MenuItem disabled value='' key='placeholder'>
										<Typography variant='inherit' color='textSecondary'>
											Choose GRN
										</Typography>
									</MenuItem>
									<MenuItem value={1}>Completed</MenuItem>
									<MenuItem value={2}>Rejected</MenuItem>
								</Select>
								{error.includes('validate-grn') && <FormHelperText error>{VALIDATION_ERROR.grnRequired}</FormHelperText>}
							</FormControl>
						</Stack>
					</Grid>
					{(purchaseOrder.grn === 1 || purchaseOrder.grn === 2) && (
						<Grid item xs={12} sm={6}>
							<Stack spacing={0.5}>
								<InputLabel>GRN Date</InputLabel>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DatePicker
										inputFormat='dd/MM/yyyy'
										value={purchaseOrder.grnDate}
										onChange={(newValue) => handleDatePickerChange('grnDate', newValue)}
										renderInput={(params) => (
											<TextField
												{...params}
												size={CONTROL_SIZE}
												error={error.includes('validate-grnDate')}
												helperText={error.includes('validate-grnDate') && VALIDATION_ERROR.grnDateRequired}
											/>
										)}
									/>
								</LocalizationProvider>
							</Stack>
						</Grid>
					)}
				</Grid>
				{purchaseOrder.grn === 2 && (
					<>
						<Grid container item spacing={1}>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Reason</InputLabel>
									<TextField placeholder='Enter Reason' fullWidth size={CONTROL_SIZE} name='reason' value={purchaseOrder.reason} onChange={onChange} />
								</Stack>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Insurance Policy Numbers</InputLabel>
									<TextField
										placeholder='Enter Insurance Policy Numbers'
										fullWidth
										size={CONTROL_SIZE}
										name='insurancePolicy'
										value={purchaseOrder.insurancePolicy}
										onChange={onChange}
									/>
								</Stack>
							</Grid>
						</Grid>
						<Grid container item spacing={1}>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Claimable Amount</InputLabel>
									<TextField
										placeholder='Enter Claimable Amount'
										fullWidth
										size={CONTROL_SIZE}
										name='claimableAmount'
										type='number'
										value={purchaseOrder.claimableAmount}
										onChange={onChange}
									/>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Claimed Amount</InputLabel>
									<TextField
										placeholder='Enter Claimed Amount'
										fullWidth
										size={CONTROL_SIZE}
										name='claimedAmount'
										type='number'
										value={purchaseOrder.claimedAmount}
										onChange={onChange}
									/>
								</Stack>
							</Grid>
						</Grid>
					</>
				)}
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={12}>
						<Stack spacing={2}>
							<Divider sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#484848' : '#e1e1e1', mt: 0.5 }} />
							<Stack direction='row' justifyContent='end' style={{ marginTop: 8, marginBottom: 16 }}>
								<Button variant='contained' color='primary' onClick={handleSubmit}>
									Save
								</Button>
							</Stack>
						</Stack>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
}

PurchaseOrderForm.propTypes = {
	handleSubmit: PropTypes.func,
	availability: PropTypes.bool,
	setAvailability: PropTypes.func,
};
