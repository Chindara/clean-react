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
import { useShipment } from '../../contexts/ShipmentsContext';
import { VALIDATION_ERROR, VALIDATION_ERROR_SHIPMENT } from 'constants/ValidationMessage';
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

export default function ShipmentForm({ handleSubmit, purchaseOrdersChoices, setPurchaseOrdersChoices }) {
	const theme = useTheme();
	const { userId, companyId } = useAuth();
	const { shipment, setShipment, error, setError, mode } = useShipment();

	const [poIdChoices, setPOIdChoices] = useState([]);
	const [clearingAgentChoices, setClearingAgentChoices] = useState([]);
	const [currencyChoices, setCurrencyChoices] = useState([]);
	const [vendorChoices, setVendorChoices] = useState([]);
	const [incoTermChoices, setIncoTermChoices] = useState([]);
	const [portChoices, setPortChoices] = useState([]);
	const [natureOfPurchaseChoices, setNatureOfPurchase] = useState([]);

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

				const [poIds = [], clearingAgents = [], currencies = [], vendors = [], incoTerms = [], ports = [], natureOfPurchase = []] = await Promise.all([
					getPoIds,
					getClearingAgents,
					getCurrencies,
					getVendors,
					getIncoTerms,
					getPorts,
					getNatureOfPurchase,
				]);

				console.log(currencies);
				console.log(vendors);

				setPOIdChoices(poIds?.data);
				setClearingAgentChoices(clearingAgents?.data);
				setCurrencyChoices(currencies?.data);
				setVendorChoices(vendors?.data);
				setIncoTermChoices(incoTerms?.data);
				setPortChoices(ports?.data);
				setNatureOfPurchase(natureOfPurchase?.data);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	const onChange = async (event) => {
		const { name, value } = event.target || event; // Support both regular event and custom event object

		let errorList = error;

		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		// Add a validation check for the amount and weight fields
		if ((name === 'amount' || name === 'weight') && parseFloat(value) <= 0) {
			errorList.push(`validate-${name}`);
			setError(errorList);
			return; // Do not update the shipment state if the amount or weight is not greater than 0
		}

		if (name === 'poId') {
			if (value === null) {
				// Handle case where no purchase order is selected
				setShipment({
					...shipment,
					currency: '',
					description: '',
					vendor: '',
					incoTerm: '',
					[name]: null,
				});
				return;
			}

			const getPurchaseOrder = PurchaseOrderService.getById(companyId, value);
			//const getPurchaseOrders = LookupService.getPurchaseOrders(companyId, value);

			const getPurchaseOrders = LookupService.getNewPurchaseOrders(companyId, value);

			const [purchaseOrder = [], purchaseOrders = []] = await Promise.all([getPurchaseOrder, getPurchaseOrders]);

			const additionalPoNumbers = purchaseOrders.data.map((po) => ({ label: po.purchaseNo, amount: po.amount, value: po.id }));
			setPurchaseOrdersChoices(additionalPoNumbers);
			console.log(additionalPoNumbers);
			console.log(purchaseOrder);
			setShipment({
				...shipment,
				currency: purchaseOrder?.data?.record?.currency,
				description: purchaseOrder?.data?.record?.description,
				vendor: purchaseOrder?.data?.record?.vendor,
				incoTerm: purchaseOrder?.data?.record?.incoTerm,
				purchaseAmount: purchaseOrder?.data?.record?.amount,
				[name]: value,
			});
			setTotal(purchaseOrder?.data?.record?.amount);
			return;
		}

		if (name === 'commercialInvoiceAmount') {
			if (parseFloat(value) > parseFloat(total)) {
				errorList.push(`validate-${name}`);
				setError(errorList);
				return; // Do not update the shipment state if the value exceeds the total
			}
		}

		setShipment({ ...shipment, [name]: value });
	};

	const onCheck = (event) => {
		const { name, checked } = event.target;
		let errorList = error;

		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		setShipment({ ...shipment, [name]: checked });
	};

	const handleDatePickerChange = (property, value) => {
		let errorList = error;
		let errorIndex = errorList.indexOf(`validate-${property}`);
		if (errorIndex !== -1) errorList.splice(errorIndex, 1);
		setError(errorList);

		setShipment((shipment) => ({ ...shipment, [property]: value }));
	};

	const handleAutoComplete = (field, value) => {
		console.log(value);
		if (field === 'purchaseOrders') {
			setShipment((shipment) => ({ ...shipment, purchaseOrders: value }));
		} else if (field === 'currency') {
			setShipment((shipment) => ({ ...shipment, currency: value }));
		}
	};

	useEffect(() => {
		const { purchaseAmount, purchaseOrders } = shipment;
		console.log(purchaseAmount);
		const totalAmount = purchaseOrders.reduce((accumulator, currentItem) => {
			return accumulator + currentItem.amount;
		}, 0);
		const finalAmount = purchaseAmount + (totalAmount > 0 ? totalAmount : 0);
		setTotal(finalAmount);
	}, [shipment]);

	return (
		<>
			<Grid container spacing={2} justifyContent='flex-end'>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Purchase Order Number</InputLabel>
							<Autocomplete
								multiple={false} // Assuming you're selecting only one purchase order number
								id='poId'
								options={poIdChoices}
								getOptionLabel={(option) => option.name}
								value={poIdChoices.find((option) => option.id === shipment.poId) || null}
								onChange={(event, value) => onChange({ target: { name: 'poId', value: value ? value.id : null } })}
								renderInput={(params) => (
									<TextField
										{...params}
										variant='outlined'
										placeholder='Choose Purchase Order Number'
										error={error.includes('validate-poId')}
										helperText={error.includes('validate-poId') ? VALIDATION_ERROR_SHIPMENT.poIdNoRequired : ''}
										disabled={mode === OPERATION_MODE.View}
									/>
								)}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Additional Purchase Order Numbers</InputLabel>
							<Autocomplete
								multiple
								id='purchaseOrders'
								options={purchaseOrdersChoices}
								getOptionLabel={(option) => option.label}
								disabled={mode === OPERATION_MODE.View}
								filterSelectedOptions
								isOptionEqualToValue={(option, value) => option?.value === value?.value}
								value={shipment.purchaseOrders}
								noOptionsText={'No Results'}
								clearOnBlur
								// onChange={(event, value) => handleAutoComplete(value)}
								onChange={(event, value) => handleAutoComplete('purchaseOrders', value)}
								renderInput={(params) => <TextField {...params} placeholder='Choose Additional Purchase Order Numbers' />}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Shipment Reference Number</InputLabel>
							<TextField
								placeholder='Enter Reference Number'
								fullWidth
								size={CONTROL_SIZE}
								name='referenceNo'
								value={shipment.referenceNo}
								onChange={onChange}
								error={error.includes('validate-referenceNo')}
								helperText={error.includes('validate-referenceNo') && VALIDATION_ERROR_SHIPMENT.referenceNoRequired}
								disabled={mode === OPERATION_MODE.View}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Vendor</InputLabel>
							<FormControl fullWidth>
								<Select variant='outlined' size={CONTROL_SIZE} name='vendor' value={shipment.vendor} onChange={onChange} disabled>
									{vendorChoices.map(({ name, id }) => (
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
							<InputLabel required>Nature Of Purchase</InputLabel>
							<Autocomplete
								multiple={false}
								id='natureOfPurchase'
								options={natureOfPurchaseChoices}
								getOptionLabel={(option) => option.name}
								value={natureOfPurchaseChoices.find((option) => option.id === shipment.natureOfPurchase) || null}
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
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Type of Cargo</InputLabel>
							<FormControl fullWidth>
								<Select
									variant='outlined'
									size={CONTROL_SIZE}
									name='typeOfCargo'
									value={shipment.typeOfCargo}
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
								{error.includes('validate-typeOfCargo') && <FormHelperText error>{VALIDATION_ERROR_SHIPMENT.typeOfCargoRequired}</FormHelperText>}
							</FormControl>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={12}>
						<Stack spacing={0.5}>
							<InputLabel required>Description</InputLabel>
							<FormControl fullWidth>
								<TextField fullWidth size={CONTROL_SIZE} multiline rows={3} name='description' value={shipment.description} onChange={onChange} disabled />
							</FormControl>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Currency</InputLabel>
							<Autocomplete
								id='c'
								options={currencyChoices}
								getOptionLabel={(option) => option}
								isOptionEqualToValue={(option, value) => option?.value === value?.value}
								value={shipment.currency || ''}
								onChange={(event, value) => handleAutoComplete('currency', value)}
								renderInput={(params) => <TextField {...params} disabled variant='outlined' />}
								disabled
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Purchase Order Amount</InputLabel>
							<TextField fullWidth size={CONTROL_SIZE} name='purchaseAmount' value={total} disabled />
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Commercial Invoice No</InputLabel>
							<TextField
								placeholder='Enter Commercial Invoice No'
								fullWidth
								size={CONTROL_SIZE}
								name='commercialInvoiceNo'
								value={shipment.commercialInvoiceNo}
								onChange={onChange}
								disabled={mode === OPERATION_MODE.View}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Commercial Invoice Amount</InputLabel>
							<TextField
								fullWidth
								size={CONTROL_SIZE}
								name='commercialInvoiceAmount'
								value={shipment.commercialInvoiceAmount}
								onChange={onChange}
								type='number'
								inputProps={{ min: 0 }}
								disabled={mode === OPERATION_MODE.View}
							/>
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
								getOptionLabel={(option) => option.name}
								value={incoTermChoices.find((option) => option.id === shipment.incoTerm) || null}
								onChange={(event, value) => onChange({ target: { name: 'incoTerm', value: value ? value.id : null } })}
								renderInput={(params) => <TextField {...params} disabled variant='outlined' />}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Shipment Type</InputLabel>
							<FormControl fullWidth>
								<Select
									variant='outlined'
									size={CONTROL_SIZE}
									name='shipmentType'
									value={shipment.shipmentType || ''}
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
								{error.includes('validate-shipmentType') && <FormHelperText error>{VALIDATION_ERROR_SHIPMENT.shipmentTypeRequired}</FormHelperText>}
							</FormControl>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Gross Weight</InputLabel>
							<TextField
								placeholder='Enter Gross Weight'
								fullWidth
								size={CONTROL_SIZE}
								name='weight'
								value={shipment.weight}
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
							<InputLabel>BL/AWB No</InputLabel>
							<TextField
								placeholder='Enter BL/AWB No'
								fullWidth
								size={CONTROL_SIZE}
								name='blawbNo'
								value={shipment.blawbNo}
								onChange={onChange}
								disabled={mode === OPERATION_MODE.View}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>MAWB</InputLabel>
							<TextField placeholder='Enter MAWB' fullWidth size={CONTROL_SIZE} name='mawb' value={shipment.mawb} onChange={onChange} disabled={mode === OPERATION_MODE.View} />
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>BL/AWB Status</InputLabel>
							<FormControl fullWidth>
								<Select
									variant='outlined'
									size={CONTROL_SIZE}
									name='blawbStatus'
									value={shipment.blawbStatus || ''}
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
							</FormControl>
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
								value={shipment.vessel}
								onChange={onChange}
								disabled={mode === OPERATION_MODE.View}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Shipping Line / Airline / Freight Forwarder</InputLabel>
							<TextField
								placeholder='Enter Shipping Line / Airline / Freight Forwarder'
								fullWidth
								size={CONTROL_SIZE}
								name='shippingLine'
								value={shipment.shippingLine}
								onChange={onChange}
								disabled={mode === OPERATION_MODE.View}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Port Of Load</InputLabel>
							<Autocomplete
								multiple={false}
								id='portOfLoad'
								options={portChoices}
								getOptionLabel={(option) => option.name}
								value={portChoices.find((option) => option.id === shipment.portOfLoad) || null}
								onChange={(event, value) => onChange({ target: { name: 'portOfLoad', value: value ? value.id : null } })}
								renderInput={(params) => <TextField {...params} variant='outlined' placeholder='Choose portOfLoad' disabled={mode === OPERATION_MODE.View} />}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Port of Discharge</InputLabel>
							<Autocomplete
								multiple={false}
								id='portOfDischarge'
								options={portChoices}
								getOptionLabel={(option) => option.name}
								value={portChoices.find((option) => option.id === shipment.portOfDischarge) || null}
								onChange={(event, value) => onChange({ target: { name: 'portOfDischarge', value: value ? value.id : null } })}
								renderInput={(params) => <TextField {...params} variant='outlined' placeholder='Choose portOfDischarge' disabled={mode === OPERATION_MODE.View} />}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Doc Received Date to SD</InputLabel>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									inputFormat='dd/MM/yyyy'
									value={shipment.docReceivedDateToSD}
									onChange={(newValue) => handleDatePickerChange('docReceivedDateToSD', newValue)}
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
								getOptionLabel={(option) => option.name}
								value={clearingAgentChoices.find((option) => option.id === shipment.clearingAgent) || null}
								onChange={(event, value) => onChange({ target: { name: 'clearingAgent', value: value ? value.id : null } })}
								renderInput={(params) => <TextField {...params} variant='outlined' placeholder='Choose clearingAgent' disabled={mode === OPERATION_MODE.View} />}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Documents To CHA</InputLabel>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									inputFormat='dd/MM/yyyy'
									value={shipment.documentsToCHA}
									onChange={(newValue) => handleDatePickerChange('documentsToCHA', newValue)}
									disabled={mode === OPERATION_MODE.View}
									renderInput={(params) => <TextField {...params} size={CONTROL_SIZE} />}
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
									value={shipment.etd}
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
							<InputLabel>ETA</InputLabel>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									inputFormat='dd/MM/yyyy'
									value={shipment.eta}
									onChange={(newValue) => handleDatePickerChange('eta', newValue)}
									disabled={mode === OPERATION_MODE.View}
									renderInput={(params) => <TextField {...params} size={CONTROL_SIZE} />}
								/>
							</LocalizationProvider>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>CUSDEC No</InputLabel>
							<TextField
								placeholder='Enter CUSDEC No'
								fullWidth
								size={CONTROL_SIZE}
								name='cusdecNo'
								value={shipment.cusdecNo}
								onChange={onChange}
								disabled={mode === OPERATION_MODE.View}
							/>
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
									value={shipment.cusdecDate}
									onChange={(newValue) => handleDatePickerChange('cusdecDate', newValue)}
									disabled={mode === OPERATION_MODE.View}
									renderInput={(params) => <TextField {...params} size={CONTROL_SIZE} error={false} />}
								/>
							</LocalizationProvider>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel>Cargo Cleared Date</InputLabel>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									inputFormat='dd/MM/yyyy'
									value={shipment.cargoClearedDate}
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
							<InputLabel>Remarks</InputLabel>
							<TextField
								placeholder='Enter Remarks'
								fullWidth
								size={CONTROL_SIZE}
								name='remarks'
								value={shipment.remarks}
								onChange={onChange}
								disabled={mode === OPERATION_MODE.View}
							/>
						</Stack>
					</Grid>
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
									checked={shipment.demurrage}
									control={<IOSSwitch />}
									disabled={mode === OPERATION_MODE.View}
								/>
							</FormGroup>
						</Stack>
					</Grid>
				</Grid>
				{shipment.demurrage === true && (
					<>
						<Grid container item spacing={1}>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Port Demurrage</InputLabel>
									<TextField
										placeholder='Enter Port Demurrage'
										fullWidth
										size={CONTROL_SIZE}
										name='portDemurrageAmount'
										value={shipment.portDemurrageAmount}
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
									<InputLabel>Reason for Port Demurrage</InputLabel>
									<TextField
										placeholder='Enter Reason for Port Demurrage'
										fullWidth
										size={CONTROL_SIZE}
										name='reasonForPortDemurrage'
										value={shipment.reasonForPortDemurrage}
										onChange={onChange}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
							</Grid>
						</Grid>
						<Grid container item spacing={1}>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Liner Demurrage</InputLabel>
									<TextField
										placeholder='Enter Liner Demurrage'
										fullWidth
										size={CONTROL_SIZE}
										name='linearDemurrageAmount'
										value={shipment.linearDemurrageAmount}
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
									<InputLabel>Reason for Liner Demurrage</InputLabel>
									<TextField
										placeholder='Enter Reason for Liner Demurrage'
										fullWidth
										size={CONTROL_SIZE}
										name='reasonForLinearDemurrage'
										value={shipment.reasonForLinearDemurrage}
										onChange={onChange}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
							</Grid>
						</Grid>{' '}
						<Grid container item spacing={1}>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Transport Detention</InputLabel>
									<TextField
										placeholder='Enter Transport Detention'
										fullWidth
										size={CONTROL_SIZE}
										name='transportDetentionAmount'
										value={shipment.transportDetentionAmount}
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
									<InputLabel>Reason for Transport Detention</InputLabel>
									<TextField
										placeholder='Enter Reason for Transport Detention'
										fullWidth
										size={CONTROL_SIZE}
										name='reasonForTransportDetention'
										value={shipment.reasonForTransportDetention}
										onChange={onChange}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
							</Grid>
						</Grid>
						<Grid container item spacing={1}>
							<Grid item xs={12} sm={6}>
								<Stack spacing={0.5}>
									<InputLabel>Demurrage Amount</InputLabel>
									<TextField
										placeholder='Enter Demurrage Amount'
										fullWidth
										size={CONTROL_SIZE}
										name='demurrageAmount'
										value={shipment.demurrageAmount}
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
										value={shipment.demurrageReason}
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
										name='claimableAmount'
										value={shipment.claimableAmount}
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
										name='claimedAmount'
										value={shipment.claimedAmount}
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
									<InputLabel>Demurrage Remarks</InputLabel>
									<TextField
										placeholder='Enter Demurrage Remarks'
										fullWidth
										size={CONTROL_SIZE}
										name='demurrageRemarks'
										value={shipment.demurrageRemarks}
										onChange={onChange}
										disabled={mode === OPERATION_MODE.View}
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
									checked={shipment.containerDeposit}
									control={<IOSSwitch />}
									disabled={mode === OPERATION_MODE.View}
								/>
							</FormGroup>
						</Stack>
					</Grid>
				</Grid>
				{shipment.containerDeposit === true && (
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
										value={shipment.containerNumbers}
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
										value={shipment.depositedAmount}
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
											value={shipment.acknowledgeInvoiceReceivedDate}
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
										value={shipment.refundedAmount}
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
										value={shipment.deductedAmount}
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
										value={shipment.chequeNo}
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
											value={shipment.chequeReceivedDate}
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
											value={shipment.chequeDepositedDate}
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
											value={shipment.acknowledgeDateToFinance}
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
										value={shipment.cdRemarks}
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

ShipmentForm.propTypes = {
	handleSubmit: PropTypes.func,
	purchaseOrdersChoices: PropTypes.array,
	setPurchaseOrdersChoices: PropTypes.func,
};
