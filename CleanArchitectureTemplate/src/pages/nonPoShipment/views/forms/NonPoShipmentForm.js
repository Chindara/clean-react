import React, { useEffect, useState } from 'react';
import moment from 'moment';

import MainCard from 'components/MainCard';
import { useTheme } from '@mui/material/styles';
import {
	Grid,
	Divider,
	TextField,
	InputLabel,
	Stack,
	Button,
	Typography,
	MenuItem,
	FormControl,
	Select,
	FormHelperText,
	FormControlLabel,
	Checkbox,
	FormGroup,
	RadioGroup,
	Radio,
	Switch,
	Autocomplete,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useNonPoShipment } from '../../contexts/NonPoShipmentContext';
import { VALIDATION_ERROR, VALIDATION_ERROR_NONPOSHIPMENT } from 'constants/ValidationMessage';
import LookupService from 'services/LookupService';
import PurchaseOrderService from 'services/PurchaseOrderService';
import { CONTROL_SIZE } from 'constants/Common';
import useAuth from 'hooks/useAuth';
import { OPERATION_MODE } from 'constants/Types';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled } from '@mui/material/styles';
import { PurchaseOrderProvider } from 'pages/purchaseOrder/contexts/PurchaseOrderContext';
import { QueryClient } from '@tanstack/react-query';
import { SHIPMENT_STATUS } from 'constants/Common';

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

export default function NonPoShipmentForm({ handleSubmit, purchaseOrdersChoices, setPurchaseOrdersChoices }) {
	const theme = useTheme();
	const { userId, companyId } = useAuth();
	const { NonPoshipment, setNonPoShipment, error, setError, mode } = useNonPoShipment();

	const [poIdChoices, setPOIdChoices] = useState([]);
	const [clearingAgentChoices, setClearingAgentChoices] = useState([]);
	const [currencyChoices, setCurrencyChoices] = useState([]);
	const [vendorChoices, setVendorChoices] = useState([]);
	const [incoTermChoices, setIncoTermChoices] = useState([]);
	const [portChoices, setPortChoices] = useState([]);
	const [natureOfPurchaseChoices, setNatureOfPurchase] = useState([]);
	const [entityChoices, setEntity] = useState([]);
	const [countryChoices, setCountryChoices] = useState([]);
	const [userChoices, setUserChoices] = useState([]);
	const [approvalChoices, setApprovalChoices] = useState([]);
	const [subPaymentMethodChoices, setSubPaymentMethod] = useState([]);

	const [total, setTotal] = useState(0);

	useEffect(() => {
		(async () => {
			try {
				const status = 3;

				const getPoIds = LookupService.getPoIdsV2(companyId, status);
				const getClearingAgents = LookupService.getClearingAgents(companyId);
				const getCurrencies = LookupService.getCurrenciesV2(companyId);
				const getVendors = LookupService.getVendors(companyId);
				const getIncoTerms = LookupService.getIncoTerms(companyId);
				const getPorts = LookupService.getPorts(companyId);
				const getNatureOfPurchase = LookupService.getNatureOfPurchase(companyId);
				const getEntity = LookupService.getEntity(companyId);
				const getCountriesV2 = LookupService.getCountriesV2();
				const getUsers = LookupService.getUsers(companyId);
				const getApprovals = LookupService.getApprovals(companyId);
				const getSubPaymentMethod = LookupService.getSubPaymentMethod(companyId);

				const [
					poIds = [],
					clearingAgents = [],
					currencies = [],
					vendors = [],
					incoTerms = [],
					ports = [],
					natureOfPurchase = [],
					entity = [],
					countries = [],
					users = [],
					approvals = [],
					subPaymentMethod = [],
				] = await Promise.all([
					getPoIds,
					getClearingAgents,
					getCurrencies,
					getVendors,
					getIncoTerms,
					getPorts,
					getNatureOfPurchase,
					getEntity,
					getCountriesV2,
					getUsers,
					getApprovals,
					getSubPaymentMethod,
				]);

				console.log(countries);

				setPOIdChoices(poIds?.data);
				setClearingAgentChoices(clearingAgents?.data);
				setCurrencyChoices(currencies?.data);
				setVendorChoices(vendors?.data);
				setIncoTermChoices(incoTerms?.data);
				setPortChoices(ports?.data);
				setNatureOfPurchase(natureOfPurchase?.data);
				setEntity(entity?.data);
				setCountryChoices(countries?.data);
				setUserChoices(users?.data);
				setApprovalChoices(approvals?.data);
				setSubPaymentMethod(subPaymentMethod?.data);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	const onChange = (event) => {
		const { name, value } = event.target;
		if (name in NonPoshipment.supportDemurrage) {
			setNonPoShipment({ ...NonPoshipment, supportDemurrage: { ...NonPoshipment.supportDemurrage, [name]: value } });
		} else if (name in NonPoshipment.supportLicense) {
			setNonPoShipment({ ...NonPoshipment, supportLicense: { ...NonPoshipment.supportLicense, [name]: value } });
		} else if (name in NonPoshipment.supportContainerDeposit) {
			setNonPoShipment({ ...NonPoshipment, supportContainerDeposit: { ...NonPoshipment.supportContainerDeposit, [name]: value } });
		} else if (name in NonPoshipment.supportGRN) {
			setNonPoShipment({
				...NonPoshipment,
				supportGRN: {
					...NonPoshipment.supportGRN,
					[name]: value,
				},
			});
		} else {
			setNonPoShipment({ ...NonPoshipment, [name]: value });
		}

		let errorList = error;
		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}
	};

	const onCheck = (event) => {
		const { name, checked } = event.target;
		if (name in NonPoshipment.supportDemurrage) {
			setNonPoShipment({ ...NonPoshipment, supportDemurrage: { ...NonPoshipment.supportDemurrage, demurrage: checked } });
		} else if (name in NonPoshipment.supportLicense) {
			setNonPoShipment({ ...NonPoshipment, supportLicense: { ...NonPoshipment.supportLicense, license: checked } });
		} else if (name in NonPoshipment.supportContainerDeposit) {
			setNonPoShipment({ ...NonPoshipment, supportContainerDeposit: { ...NonPoshipment.supportContainerDeposit, containerDeposit: checked } });
		}
	};

	const handleDatePickerChange = (name, value) => {
		let errorList = error;
		let errorIndex = errorList.indexOf(`validate-${name}`);
		if (errorIndex !== -1) errorList.splice(errorIndex, 1);
		setError(errorList);

		// Format the date value as a string
		const formattedDate = value instanceof Date ? value.toISOString() : value;

		setNonPoShipment((NonPoshipment) => {
			if (name in NonPoshipment.supportDemurrage) {
				return {
					...NonPoshipment,
					supportDemurrage: {
						...NonPoshipment.supportDemurrage,
						[name]: formattedDate,
					},
				};
			} else if (name in NonPoshipment.supportLicense) {
				return {
					...NonPoshipment,
					supportLicense: {
						...NonPoshipment.supportLicense,
						[name]: formattedDate,
					},
				};
			} else if (name in NonPoshipment.supportContainerDeposit) {
				return {
					...NonPoshipment,
					supportContainerDeposit: {
						...NonPoshipment.supportContainerDeposit,
						[name]: formattedDate,
					},
				};
			} else if (name in NonPoshipment.supportGRN) {
				return {
					...NonPoshipment,
					supportGRN: {
						...NonPoshipment.supportGRN,
						[name]: formattedDate,
					},
				};
			} else {
				return {
					...NonPoshipment,
					[name]: formattedDate,
				};
			}
		});
	};

	const handleAutoComplete = (field, value) => {
		setError((prevError) => prevError.filter((err) => err !== `validate-${field}`));
		console.log(value);
		if (field === 'purchaseOrders') {
			setNonPoShipment((NonPoshipment) => ({ ...NonPoshipment, purchaseOrders: value }));
		} else if (field === 'currency') {
			setNonPoShipment((NonPoshipment) => ({ ...NonPoshipment, currency: value }));
		} else {
			setNonPoShipment({ ...NonPoshipment, [field]: value });
		}
	};

	return (
		<>
			<Grid container spacing={2} justifyContent='flex-end'>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Shipment Reference Number</InputLabel>
							<TextField
								placeholder='Enter Reference Number'
								fullWidth
								size={CONTROL_SIZE}
								name='shipmentReferenceNo'
								value={NonPoshipment.shipmentReferenceNo}
								onChange={onChange}
								error={error.includes('validate-shipmentReferenceNo')}
								helperText={error.includes('validate-shipmentReferenceNo') && VALIDATION_ERROR_NONPOSHIPMENT.referenceNoRequired}
								disabled={mode === OPERATION_MODE.View}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Purchase Order Number</InputLabel>
							<TextField
								placeholder='Enter Purchase Order Number'
								fullWidth
								size={CONTROL_SIZE}
								name='poNumber'
								value={NonPoshipment.poNumber}
								onChange={onChange}
								disabled={mode === OPERATION_MODE.View}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Additional Purchase Order Numbers</InputLabel>
							<TextField
								placeholder='Enter Additional Purchase Order Number'
								fullWidth
								size={CONTROL_SIZE}
								name='additionalPONumber'
								value={NonPoshipment.additionalPONumber}
								onChange={onChange}
								disabled={mode === OPERATION_MODE.View}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Entity</InputLabel>
							<Autocomplete
								multiple={false}
								id='entity'
								options={entityChoices}
								getOptionLabel={(option) => option.name}
								disabled={mode === OPERATION_MODE.View}
								value={entityChoices.find((option) => option.id === NonPoshipment.entity) || null}
								onChange={(event, value) => onChange({ target: { name: 'entity', value: value ? value.id : null } })}
								renderInput={(params) => (
									<TextField
										{...params}
										variant='outlined'
										placeholder='Choose entity'
										error={error.includes('validate-entity')}
										helperText={error.includes('validate-entity') ? VALIDATION_ERROR_NONPOSHIPMENT.entityRequired : ''}
									/>
								)}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={12}>
						<Stack spacing={0.5}>
							<InputLabel required>Description</InputLabel>
							<FormControl fullWidth>
								<TextField
									placeholder='Enter Description'
									fullWidth
									size={CONTROL_SIZE}
									multiline
									rows={3}
									name='description'
									value={NonPoshipment.description}
									onChange={onChange}
									disabled={mode === OPERATION_MODE.View}
									error={error.includes('validate-description')}
									helperText={error.includes('validate-description') && VALIDATION_ERROR_NONPOSHIPMENT.descriptionRequired}
								/>
							</FormControl>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Nature of Cargo</InputLabel>
							<Autocomplete
								multiple={false}
								id='natureOfPurchase'
								options={natureOfPurchaseChoices}
								disabled={mode === OPERATION_MODE.View}
								getOptionLabel={(option) => option.name}
								value={natureOfPurchaseChoices.find((option) => option.id === NonPoshipment.natureOfPurchase) || null}
								onChange={(event, value) => onChange({ target: { name: 'natureOfPurchase', value: value ? value.id : null } })}
								renderInput={(params) => (
									<TextField
										{...params}
										variant='outlined'
										placeholder='Choose natureOfPurchase'
										error={error.includes('validate-natureOfPurchase')}
										helperText={error.includes('validate-natureOfPurchase') ? VALIDATION_ERROR_NONPOSHIPMENT.natureOfPurchaseRequired : ''}
									/>
								)}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Type of Cargo</InputLabel>
							<FormControl fullWidth>
								<Select
									variant='outlined'
									size={CONTROL_SIZE}
									name='typeOfCargo'
									value={NonPoshipment.typeOfCargo}
									onChange={onChange}
									error={error.includes('validate-typeOfCargo')}
									displayEmpty
									disabled={mode === OPERATION_MODE.View}
								>
									<MenuItem disabled value='' key='placeholder'>
										<Typography variant='inherit' color='textSecondary'>
											Choose Type of Cargo
										</Typography>
									</MenuItem>
									<MenuItem value={1}>Dangerous Goods</MenuItem>
									<MenuItem value={2}>General</MenuItem>
								</Select>
								{error.includes('validate-typeOfCargo') && <FormHelperText error>{VALIDATION_ERROR_NONPOSHIPMENT.typeOfCargoRequired}</FormHelperText>}
							</FormControl>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Vendor</InputLabel>
							<FormControl fullWidth>
								<Select
									variant='outlined'
									size={CONTROL_SIZE}
									name='vendor'
									value={NonPoshipment.vendor}
									onChange={onChange}
									error={error.includes('validate-vendor')}
									displayEmpty
									disabled={mode === OPERATION_MODE.View}
								>
									<MenuItem disabled value='' key='placeholder'>
										<Typography variant='inherit' color='textSecondary'>
											Choose vendor
										</Typography>
									</MenuItem>
									{vendorChoices.map(({ name, id }) => (
										<MenuItem key={id} value={id}>
											{name}
										</MenuItem>
									))}
								</Select>
								{error.includes('validate-vendor') && <FormHelperText error>{VALIDATION_ERROR_NONPOSHIPMENT.vendorRequired}</FormHelperText>}
							</FormControl>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Country</InputLabel>
							<Autocomplete
								id='country'
								options={countryChoices}
								disabled={mode === OPERATION_MODE.View}
								getOptionLabel={(option) => option}
								isOptionEqualToValue={(option, value) => option?.value === value?.value}
								value={NonPoshipment.country || null}
								onChange={(event, value) => handleAutoComplete('country', value)}
								renderInput={(params) => (
									<TextField
										{...params}
										variant='outlined'
										placeholder='Choose Country'
										error={error.includes('validate-country')}
										helperText={error.includes('validate-country') ? VALIDATION_ERROR_NONPOSHIPMENT.countryRequired : ''}
									/>
								)}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Volume</InputLabel>
							<TextField
								placeholder='Enter Volume'
								fullWidth
								size={CONTROL_SIZE}
								name='volume'
								value={NonPoshipment.volume}
								onChange={onChange}
								disabled={mode === OPERATION_MODE.View}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Quantity</InputLabel>
							<TextField
								placeholder='Enter Quantity'
								fullWidth
								size={CONTROL_SIZE}
								name='quantity'
								value={NonPoshipment.quantity}
								onChange={onChange}
								disabled={mode === OPERATION_MODE.View}
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
									value={NonPoshipment.buyer}
									onChange={onChange}
									error={error.includes('validate-buyer')}
									displayEmpty
									disabled={mode === OPERATION_MODE.View}
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
								{error.includes('validate-buyer') && <FormHelperText error>{VALIDATION_ERROR_NONPOSHIPMENT.buyerRequired}</FormHelperText>}
							</FormControl>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>User</InputLabel>
							<FormControl fullWidth>
								<Select
									variant='outlined'
									size={CONTROL_SIZE}
									name='user'
									value={NonPoshipment.user || ''}
									onChange={onChange}
									displayEmpty
									disabled={mode === OPERATION_MODE.View}
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
							</FormControl>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>License</InputLabel>
							<FormGroup>
								<FormControlLabel
									size={CONTROL_SIZE}
									name='license'
									onChange={onCheck}
									checked={NonPoshipment.supportLicense.license}
									control={<IOSSwitch />}
									disabled={mode === OPERATION_MODE.View}
								/>
							</FormGroup>
						</Stack>
					</Grid>
				</Grid>
				{NonPoshipment.supportLicense.license === true && (
					<>
						<Grid container item spacing={1}>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Approval</InputLabel>
									<FormControl fullWidth>
										<Select
											placeholder='Chose Approval'
											variant='outlined'
											size={CONTROL_SIZE}
											name='approval'
											value={NonPoshipment.supportLicense.approval}
											onChange={onChange}
											disabled={mode === OPERATION_MODE.View}
										>
											{approvalChoices.map(({ name, id }) => (
												<MenuItem key={id} value={id}>
													{name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Approval Date</InputLabel>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DatePicker
											inputFormat='dd/MM/yyyy'
											value={NonPoshipment.supportLicense.approvalDate}
											onChange={(newValue) => handleDatePickerChange('approvalDate', newValue)}
											disabled={mode === OPERATION_MODE.View}
											renderInput={(params) => <TextField {...params} size={CONTROL_SIZE} />}
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
										placeholder='Enter Approval'
										fullWidth
										size={CONTROL_SIZE}
										name='approvalReference'
										value={NonPoshipment.supportLicense.approvalReference}
										onChange={onChange}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Approval Expiry Date</InputLabel>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DatePicker
											inputFormat='dd/MM/yyyy'
											value={NonPoshipment.supportLicense.approvalExpiry}
											onChange={(newValue) => handleDatePickerChange('approvalExpiry', newValue)}
											disabled={mode === OPERATION_MODE.View}
											renderInput={(params) => <TextField {...params} size={CONTROL_SIZE} />}
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
							<InputLabel required>Payment Method/Term</InputLabel>
							<Autocomplete
								multiple={false} // Assuming you're selecting only one purchase order number
								id='paymentMethod'
								options={subPaymentMethodChoices}
								disabled={mode === OPERATION_MODE.View}
								getOptionLabel={(option) => option.name}
								value={subPaymentMethodChoices.find((option) => option.id === NonPoshipment.paymentMethod) || null}
								onChange={(event, value) => onChange({ target: { name: 'paymentMethod', value: value ? value.id : null } })}
								renderInput={(params) => (
									<TextField
										{...params}
										variant='outlined'
										placeholder='Choose payment Method'
										error={error.includes('validate-paymentMethod')}
										helperText={error.includes('validate-paymentMethod') ? VALIDATION_ERROR_NONPOSHIPMENT.paymentMethodRequired : ''}
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
									value={NonPoshipment.transportMode || ''}
									onChange={onChange}
									error={error.includes('validate-transportMode')}
									displayEmpty
									disabled={mode === OPERATION_MODE.View}
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
								{error.includes('validate-transportMode') && <FormHelperText error>{VALIDATION_ERROR_NONPOSHIPMENT.transportModeRequired}</FormHelperText>}
							</FormControl>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Inco Term</InputLabel>
							<Autocomplete
								multiple={false}
								id='incoTerm'
								options={incoTermChoices}
								disabled={mode === OPERATION_MODE.View}
								getOptionLabel={(option) => option.name}
								value={incoTermChoices.find((option) => option.id === NonPoshipment.incoTerm) || null}
								onChange={(event, value) => onChange({ target: { name: 'incoTerm', value: value ? value.id : null } })}
								renderInput={(params) => (
									<TextField
										{...params}
										variant='outlined'
										placeholder='Choose incoTerm'
										error={error.includes('validate-incoTerm')}
										helperText={error.includes('validate-incoTerm') ? VALIDATION_ERROR_NONPOSHIPMENT.incoTermRequired : ''}
									/>
								)}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>CI Number</InputLabel>
							<TextField
								placeholder='Enter Commercial Invoice No'
								fullWidth
								size={CONTROL_SIZE}
								name='commercialInvoiceNo'
								value={NonPoshipment.commercialInvoiceNo}
								onChange={onChange}
								disabled={mode === OPERATION_MODE.View}
								error={error.includes('validate-commercialInvoiceNo')}
								helperText={error.includes('validate-commercialInvoiceNo') && VALIDATION_ERROR_NONPOSHIPMENT.commercialInvoiceNoRequired}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Currency</InputLabel>
							<Autocomplete
								id='currency'
								options={currencyChoices}
								getOptionLabel={(option) => option}
								disabled={mode === OPERATION_MODE.View}
								isOptionEqualToValue={(option, value) => option?.value === value?.value}
								value={NonPoshipment.currency || ''}
								onChange={(event, value) => handleAutoComplete('currency', value)}
								renderInput={(params) => (
									<TextField
										{...params}
										variant='outlined'
										placeholder='Choose Currency'
										error={error.includes('validate-currency')}
										helperText={error.includes('validate-currency') ? VALIDATION_ERROR_NONPOSHIPMENT.currencyRequired : ''}
									/>
								)}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Shipment Amount</InputLabel>
							<TextField
								placeholder='Enter Shipment Amount'
								fullWidth
								size={CONTROL_SIZE}
								name='shipmentAmount'
								value={NonPoshipment.shipmentAmount}
								onChange={onChange}
								type='number'
								disabled={mode === OPERATION_MODE.View}
								error={error.includes('validate-shipmentAmount')}
								helperText={error.includes('validate-shipmentAmount') && VALIDATION_ERROR_NONPOSHIPMENT.shipmentAmountRequired}
								onKeyPress={(e) => {
									const charCode = e.which ? e.which : e.keyCode;
									if (charCode > 31 && (charCode < 48 || charCode > 57)) {
										e.preventDefault();
									}
								}}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Shipment Type</InputLabel>
							<FormControl fullWidth>
								<Select
									variant='outlined'
									size={CONTROL_SIZE}
									name='shipmentType'
									value={NonPoshipment.shipmentType || ''}
									onChange={onChange}
									error={error.includes('validate-shipmentType')}
									displayEmpty
									disabled={mode === OPERATION_MODE.View}
								>
									<MenuItem disabled value='' key='placeholder'>
										<Typography variant='inherit' color='textSecondary'>
											Choose Shipment Type
										</Typography>
									</MenuItem>
									<MenuItem value={1}>FCL</MenuItem>
									<MenuItem value={2}>LCL</MenuItem>
									<MenuItem value={3}>Courier</MenuItem>
									<MenuItem value={4}>AF</MenuItem>
									<MenuItem value={5}>Bulk</MenuItem>
								</Select>
								{error.includes('validate-shipmentType') && <FormHelperText error>{VALIDATION_ERROR_NONPOSHIPMENT.shipmentTypeRequired}</FormHelperText>}
							</FormControl>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Shipping Line/Air Line/Freight Forwarder</InputLabel>
							<TextField
								placeholder='Enter Shipping Line / Airline / Freight Forwarder'
								fullWidth
								size={CONTROL_SIZE}
								name='shippingLine'
								value={NonPoshipment.shippingLine}
								onChange={onChange}
								disabled={mode === OPERATION_MODE.View}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Vessel / Voyage / Flight</InputLabel>
							<TextField
								placeholder='Enter Vessel / Voyage / Flight'
								fullWidth
								size={CONTROL_SIZE}
								name='vessel'
								value={NonPoshipment.vessel}
								onChange={onChange}
								disabled={mode === OPERATION_MODE.View}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Port Of Loading</InputLabel>
							<Autocomplete
								multiple={false}
								id='portOfLoad'
								options={portChoices}
								disabled={mode === OPERATION_MODE.View}
								getOptionLabel={(option) => option.name}
								value={portChoices.find((option) => option.id === NonPoshipment.portOfLoad) || null}
								onChange={(event, value) => onChange({ target: { name: 'portOfLoad', value: value ? value.id : null } })}
								renderInput={(params) => <TextField {...params} variant='outlined' placeholder='Choose portOfLoad' />}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>BL/AWB Status</InputLabel>
							<FormControl fullWidth>
								<Select
									variant='outlined'
									size={CONTROL_SIZE}
									name='blawbStatus'
									value={NonPoshipment.blawbStatus || ''}
									onChange={onChange}
									error={error.includes('validate-blawbStatus')}
									displayEmpty
									disabled={mode === OPERATION_MODE.View}
								>
									<MenuItem disabled value='' key='placeholder'>
										<Typography variant='inherit' color='textSecondary'>
											Choose BL/AWB
										</Typography>
									</MenuItem>
									<MenuItem value={1}>Original</MenuItem>
									<MenuItem value={2}>Seaway</MenuItem>
									<MenuItem value={3}>Express</MenuItem>
									<MenuItem value={4}>Surrender</MenuItem>
									<MenuItem value={5}>TelexRelease</MenuItem>
								</Select>
								{error.includes('validate-blawbStatus') && <FormHelperText error>{VALIDATION_ERROR_NONPOSHIPMENT.blawbStatusRequired}</FormHelperText>}
							</FormControl>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Port of Discharge</InputLabel>
							<Autocomplete
								multiple={false}
								id='portOfDischarge'
								options={portChoices}
								disabled={mode === OPERATION_MODE.View}
								getOptionLabel={(option) => option.name}
								value={portChoices.find((option) => option.id === NonPoshipment.portOfDischarge) || null}
								onChange={(event, value) => onChange({ target: { name: 'portOfDischarge', value: value ? value.id : null } })}
								renderInput={(params) => <TextField {...params} variant='outlined' placeholder='Choose portOfDischarge' />}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>BL/AWB</InputLabel>
							<TextField
								placeholder='Enter BL/AWB No'
								fullWidth
								size={CONTROL_SIZE}
								name='blawbNo'
								value={NonPoshipment.blawbNo}
								onChange={onChange}
								disabled={mode === OPERATION_MODE.View}
								error={error.includes('validate-blawbNo')}
								helperText={error.includes('validate-blawbNo') ? VALIDATION_ERROR_NONPOSHIPMENT.blawbNoRequired : ''}
							/>
						</Stack>
					</Grid>

					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>MAWB</InputLabel>
							<TextField
								placeholder='Enter MAWB'
								fullWidth
								size={CONTROL_SIZE}
								name='mawb'
								value={NonPoshipment.mawb}
								onChange={onChange}
								disabled={mode === OPERATION_MODE.View}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>ETA</InputLabel>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									inputFormat='dd/MM/yyyy'
									value={NonPoshipment.eta}
									onChange={(newValue) => handleDatePickerChange('eta', newValue)}
									disabled={mode === OPERATION_MODE.View}
									renderInput={(params) => (
										<TextField
											{...params}
											size={CONTROL_SIZE}
											error={error.includes('validate-eta')}
											helperText={error.includes('validate-eta') && VALIDATION_ERROR_NONPOSHIPMENT.etaRequired}
										/>
									)}
								/>
							</LocalizationProvider>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>ETD</InputLabel>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									inputFormat='dd/MM/yyyy'
									value={NonPoshipment.etd}
									onChange={(newValue) => handleDatePickerChange('etd', newValue)}
									disabled={mode === OPERATION_MODE.View}
									renderInput={(params) => <TextField {...params} size={CONTROL_SIZE} />}
								/>
							</LocalizationProvider>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Revised ETA</InputLabel>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									inputFormat='dd/MM/yyyy'
									value={NonPoshipment.revisedEta}
									onChange={(newValue) => handleDatePickerChange('revisedEta', newValue)}
									disabled={mode === OPERATION_MODE.View}
									renderInput={(params) => <TextField {...params} size={CONTROL_SIZE} />}
								/>
							</LocalizationProvider>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Clearing Agent</InputLabel>
							<Autocomplete
								multiple={false}
								id='clearingAgent'
								options={clearingAgentChoices}
								disabled={mode === OPERATION_MODE.View}
								getOptionLabel={(option) => option.name}
								value={clearingAgentChoices.find((option) => option.id === NonPoshipment.clearingAgent) || null}
								onChange={(event, value) => onChange({ target: { name: 'clearingAgent', value: value ? value.id : null } })}
								renderInput={(params) => <TextField {...params} variant='outlined' placeholder='Choose clearingAgent' />}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Doc Received Date</InputLabel>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									inputFormat='dd/MM/yyyy'
									value={NonPoshipment.docReceivedDate}
									onChange={(newValue) => handleDatePickerChange('docReceivedDate', newValue)}
									disabled={mode === OPERATION_MODE.View}
									renderInput={(params) => <TextField {...params} size={CONTROL_SIZE} />}
								/>
							</LocalizationProvider>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Documents To CHA</InputLabel>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									inputFormat='dd/MM/yyyy'
									value={NonPoshipment.documentsToCHA}
									onChange={(newValue) => handleDatePickerChange('documentsToCHA', newValue)}
									disabled={mode === OPERATION_MODE.View}
									renderInput={(params) => <TextField {...params} size={CONTROL_SIZE} />}
								/>
							</LocalizationProvider>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>CUSDEC Number</InputLabel>
							<TextField
								placeholder='Enter CUSDEC No'
								fullWidth
								size={CONTROL_SIZE}
								name='cusdecNo'
								value={NonPoshipment.cusdecNo}
								onChange={onChange}
								disabled={mode === OPERATION_MODE.View}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Cargo Cleared Date</InputLabel>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									inputFormat='dd/MM/yyyy'
									value={NonPoshipment.cargoClearedDate}
									onChange={(newValue) => handleDatePickerChange('cargoClearedDate', newValue)}
									disabled={mode === OPERATION_MODE.View}
									renderInput={(params) => <TextField {...params} size={CONTROL_SIZE} error={false} />}
								/>
							</LocalizationProvider>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>CUSDEC Date</InputLabel>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									inputFormat='dd/MM/yyyy'
									value={NonPoshipment.cusdecDate}
									onChange={(newValue) => handleDatePickerChange('cusdecDate', newValue)}
									disabled={mode === OPERATION_MODE.View}
									renderInput={(params) => <TextField {...params} size={CONTROL_SIZE} error={false} />}
								/>
							</LocalizationProvider>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Remarks</InputLabel>
							<TextField
								placeholder='Enter Remarks'
								fullWidth
								size={CONTROL_SIZE}
								name='remarks'
								value={NonPoshipment.remarks}
								onChange={onChange}
								disabled={mode === OPERATION_MODE.View}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>GRN</InputLabel>
							<FormControl fullWidth>
								<Select
									variant='outlined'
									size={CONTROL_SIZE}
									name='grn'
									value={NonPoshipment.supportGRN.grn || ''}
									onChange={onChange}
									displayEmpty
									disabled={mode === OPERATION_MODE.View}
								>
									<MenuItem disabled value='' key='placeholder'>
										<Typography variant='inherit' color='textSecondary'>
											Choose GRN
										</Typography>
									</MenuItem>
									<MenuItem value={false}>Completed</MenuItem>
									<MenuItem value={true}>Rejected</MenuItem>
								</Select>
								{error.includes('validate-grn') && <FormHelperText error>{VALIDATION_ERROR.grnRequired}</FormHelperText>}
							</FormControl>
						</Stack>
					</Grid>

					{(NonPoshipment.supportGRN.grn === false || NonPoshipment.supportGRN.grn === true) && (
						<Grid item xs={12} sm={6}>
							<Stack spacing={0.5}>
								<InputLabel>GRN Date</InputLabel>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DatePicker
										inputFormat='dd/MM/yyyy'
										value={NonPoshipment.supportGRN.grnDate}
										onChange={(newValue) => handleDatePickerChange('grnDate', newValue)}
										disabled={mode === OPERATION_MODE.View}
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

					{NonPoshipment.supportGRN.grn === true && (
						<>
							<Grid container item spacing={1}>
								<Grid item xs={12} sm={6}>
									<Stack spacing={0.5}>
										<InputLabel>Reason</InputLabel>
										<TextField
											placeholder='Enter Reason'
											fullWidth
											size={CONTROL_SIZE}
											name='grnRejectedReason'
											value={NonPoshipment.supportGRN.grnRejectedReason}
											onChange={onChange}
											disabled={mode === OPERATION_MODE.View}
										/>
									</Stack>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Stack spacing={0.5}>
										<InputLabel>Insurance Policy Numbers</InputLabel>
										<TextField
											placeholder='Enter Insurance Policy Numbers'
											fullWidth
											size={CONTROL_SIZE}
											name='insurancePolicyNumbers'
											value={NonPoshipment.supportGRN.insurancePolicyNumbers}
											onChange={onChange}
											disabled={mode === OPERATION_MODE.View}
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
											name='grnClaimableAmount'
											value={NonPoshipment.supportGRN.grnClaimableAmount}
											onChange={onChange}
											type='number'
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
								<Grid item xs={12} sm={6}>
									<Stack spacing={0.5}>
										<InputLabel>Claimed Amount</InputLabel>
										<TextField
											placeholder='Enter Claimed Amount'
											fullWidth
											size={CONTROL_SIZE}
											name='grnClaimedAmount'
											value={NonPoshipment.supportGRN.grnClaimedAmount}
											onChange={onChange}
											type='number'
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
							</Grid>
						</>
					)}
				</Grid>

				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Demurrage</InputLabel>
							<FormGroup>
								<FormControlLabel
									size={CONTROL_SIZE}
									name='demurrage'
									onChange={onCheck}
									checked={NonPoshipment.supportDemurrage.demurrage}
									control={<IOSSwitch />}
									disabled={mode === OPERATION_MODE.View}
								/>
							</FormGroup>
						</Stack>
					</Grid>
				</Grid>
				{NonPoshipment.supportDemurrage.demurrage && (
					<>
						<Grid container item spacing={1}>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Demurrage Amount</InputLabel>
									<TextField
										placeholder='Enter Demurrage Amount'
										fullWidth
										size={CONTROL_SIZE}
										name='demurrageAmount'
										value={NonPoshipment.supportDemurrage.demurrageAmount}
										onChange={onChange}
										type='number'
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
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Demurrage Reason</InputLabel>
									<TextField
										placeholder='Enter Demurrage Reason'
										fullWidth
										size={CONTROL_SIZE}
										name='demurrageReason'
										value={NonPoshipment.supportDemurrage.demurrageReason}
										onChange={onChange}
										disabled={mode === OPERATION_MODE.View}
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
										name='demurrageClaimableAmount'
										value={NonPoshipment.supportDemurrage.demurrageClaimableAmount}
										onChange={onChange}
										type='number'
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
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Claimed Amount</InputLabel>
									<TextField
										placeholder='Enter Claimed Amount'
										fullWidth
										size={CONTROL_SIZE}
										name='demurrageClaimedAmount'
										value={NonPoshipment.supportDemurrage.demurrageClaimedAmount}
										onChange={onChange}
										type='number'
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
						</Grid>
					</>
				)}
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Container Deposit</InputLabel>
							<FormGroup>
								<FormControlLabel
									size={CONTROL_SIZE}
									name='containerDeposit'
									onChange={onCheck}
									checked={NonPoshipment.supportContainerDeposit.containerDeposit}
									control={<IOSSwitch />}
									disabled={mode === OPERATION_MODE.View}
								/>
							</FormGroup>
						</Stack>
					</Grid>
				</Grid>
				{NonPoshipment.supportContainerDeposit.containerDeposit === true && (
					<>
						<Grid container item spacing={1}>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Container Number</InputLabel>
									<TextField
										placeholder='Container Number'
										fullWidth
										size={CONTROL_SIZE}
										name='containerNumbers'
										value={NonPoshipment.supportContainerDeposit.containerNumbers}
										onChange={onChange}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Deposited Amount</InputLabel>
									<TextField
										placeholder='Enter Deposited Amount'
										fullWidth
										size={CONTROL_SIZE}
										name='depositedAmount'
										value={NonPoshipment.supportContainerDeposit.depositedAmount}
										onChange={onChange}
										type='number'
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
						</Grid>
						<Grid container item spacing={1}>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Acknowledge Invoice Received Date</InputLabel>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DatePicker
											inputFormat='dd/MM/yyyy'
											value={NonPoshipment.supportContainerDeposit.acknowledgeInvoiceReceivedDate}
											onChange={(newValue) => handleDatePickerChange('acknowledgeInvoiceReceivedDate', newValue)}
											disabled={mode === OPERATION_MODE.View}
											renderInput={(params) => <TextField {...params} size={CONTROL_SIZE} error={false} />}
										/>
									</LocalizationProvider>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Refund Amount</InputLabel>
									<TextField
										placeholder='Enter Refund Amount'
										fullWidth
										size={CONTROL_SIZE}
										name='refundedAmount'
										value={NonPoshipment.supportContainerDeposit.refundedAmount}
										onChange={onChange}
										type='number'
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
						</Grid>
						<Grid container item spacing={1}>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Deducted Amount</InputLabel>
									<TextField
										placeholder='Enter Deducted Amount'
										fullWidth
										size={CONTROL_SIZE}
										name='deductedAmount'
										value={NonPoshipment.supportContainerDeposit.deductedAmount}
										onChange={onChange}
										type='number'
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
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Cheque Number</InputLabel>
									<TextField
										placeholder='Cheque No'
										fullWidth
										size={CONTROL_SIZE}
										name='chequeNo'
										value={NonPoshipment.supportContainerDeposit.chequeNo}
										onChange={onChange}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
							</Grid>
						</Grid>
						<Grid container item spacing={1}>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Cheque Received Date</InputLabel>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DatePicker
											inputFormat='dd/MM/yyyy'
											value={NonPoshipment.supportContainerDeposit.chequeReceivedDate}
											onChange={(newValue) => handleDatePickerChange('chequeReceivedDate', newValue)}
											disabled={mode === OPERATION_MODE.View}
											renderInput={(params) => <TextField {...params} size={CONTROL_SIZE} error={false} />}
										/>
									</LocalizationProvider>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Cheque Deposited Date</InputLabel>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DatePicker
											inputFormat='dd/MM/yyyy'
											value={NonPoshipment.supportContainerDeposit.chequeDepositedDate}
											onChange={(newValue) => handleDatePickerChange('chequeDepositedDate', newValue)}
											disabled={mode === OPERATION_MODE.View}
											renderInput={(params) => <TextField {...params} size={CONTROL_SIZE} error={false} />}
										/>
									</LocalizationProvider>
								</Stack>
							</Grid>
						</Grid>
						<Grid container item spacing={1}>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Acknowledge Date to Finance</InputLabel>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DatePicker
											inputFormat='dd/MM/yyyy'
											value={NonPoshipment.supportContainerDeposit.acknowledgeDateToFinance}
											onChange={(newValue) => handleDatePickerChange('acknowledgeDateToFinance', newValue)}
											disabled={mode === OPERATION_MODE.View}
											renderInput={(params) => <TextField {...params} size={CONTROL_SIZE} error={false} />}
										/>
									</LocalizationProvider>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>CD Remarks</InputLabel>
									<TextField
										placeholder='Enter CD Remarks'
										fullWidth
										size={CONTROL_SIZE}
										name='cdRemarks'
										value={NonPoshipment.supportContainerDeposit.cdRemarks}
										onChange={onChange}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
							</Grid>
						</Grid>
					</>
				)}
				{(mode === OPERATION_MODE.Create || mode === OPERATION_MODE.Edit) && (
					<Grid container item spacing={1}>
						<Grid item xs={12} sm={12}>
							<Stack spacing={2}>
								<Divider
									sx={{
										backgroundColor: theme.palette.mode === 'dark' ? '#484848' : '#e1e1e1',
										mt: 0.5,
									}}
								/>
								<Stack direction='row' justifyContent='end' style={{ marginTop: 8, marginBottom: 16 }}>
									<Button variant='contained' color='primary' onClick={handleSubmit}>
										Save
									</Button>
								</Stack>
							</Stack>
						</Grid>
					</Grid>
				)}
			</Grid>
		</>
	);
}

NonPoShipmentForm.propTypes = {
	handleSubmit: PropTypes.func,
	purchaseOrdersChoices: PropTypes.array,
	setPurchaseOrdersChoices: PropTypes.func,
};
