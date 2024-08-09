import React, { useEffect, useId, useState } from 'react';
import PropTypes from 'prop-types';

// MUI
import { Grid, TextField, InputLabel, Stack, Box, Skeleton, FormHelperText, MenuItem, Select, Typography } from '@mui/material';
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
import { VALIDATION_ERROR_SHIPMENT_DUTY } from 'constants/ValidationMessage';
import { CONTROL_SIZE } from 'constants/Common';
import MainCard from 'components/MainCard';

// ==============================|| DUTY FORM ||============================== //
export default function DutyForm({ isFetching }) {
	const id = useId();

	const theme = useTheme();
	//const { userId, companyId } = useAuth();
	const { duty, setDuty, error, setError, mode } = useNonPoShipment();

	const [total, setTotal] = useState(0);

	useEffect(() => {
		const { cid, vat, pal, xid, eic, ssl, scl, penalty, surcharge, additionalCharge } = duty;

		const cid2 = parseFloat(cid);
		const vat2 = parseFloat(vat);
		const pal2 = parseFloat(pal);
		const xid2 = parseFloat(xid);
		const eic2 = parseFloat(eic);
		const ssl2 = parseFloat(ssl);
		const scl2 = parseFloat(scl);
		const penalty2 = parseFloat(penalty);
		const surcharge2 = parseFloat(surcharge);
		const additionalCharge2 = parseFloat(additionalCharge);

		let total = 0;
		if (!isNaN(cid2)) total += cid2;
		if (!isNaN(vat2)) total += vat2;
		if (!isNaN(pal2)) total += pal2;
		if (!isNaN(xid2)) total += xid2;
		if (!isNaN(eic2)) total += eic2;
		if (!isNaN(ssl2)) total += ssl2;
		if (!isNaN(scl2)) total += scl2;
		if (!isNaN(penalty2)) total += penalty2;
		if (!isNaN(surcharge2)) total += surcharge2;
		if (!isNaN(additionalCharge2)) total += additionalCharge2;

		setTotal(total);
	}, [duty]);

	const handleDuty = (event) => {
		const { name, value } = event.target;

		let errorList = error;
		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		setDuty({ ...duty, [name]: value });
		//calculateTotal();
	};

	const handleDatePickerChange = (property, value) => {
		let errorList = error;
		let errorIndex = errorList.indexOf(`validate-${property}`);
		if (errorIndex !== -1) errorList.splice(errorIndex, 1);
		setError(errorList);

		setDuty((prevState) => ({ ...prevState, [property]: value }));
	};
	//console.log(duty);

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
				<>
					<MainCard>
						<Grid container spacing={1} justifyContent='flex-start'>
							<Grid item xs={12}>
								<Stack spacing={0.5}>
									<InputLabel required>HS Code</InputLabel>
									<TextField
										placeholder='CODE'
										fullWidth
										size={CONTROL_SIZE}
										name='hsCode'
										value={duty.hsCode || ''}
										error={error.includes('validate-hsCode') || error.includes('validate-hsCode-format')}
										helperText={
											(error.includes('validate-hsCode') && VALIDATION_ERROR_SHIPMENT_DUTY.hsCodeRequired) ||
											(error.includes('validate-hsCode-format') && VALIDATION_ERROR_SHIPMENT_DUTY.hsCodeValidation)
										}
										onChange={(e) => {
											handleDuty(e);
											if (error.includes('validate-hsCode') || error.includes('validate-hsCode-format')) {
												setError(error.filter((err) => !err.startsWith('validate-hsCode')));
											}
										}}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
							</Grid>
							<Grid item xs={4}>
								<Stack spacing={0.5}>
									{/* <InputLabel required>CID</InputLabel>
								<TextField
									placeholder='ENTER AMOUNT'
									fullWidth
									size={CONTROL_SIZE}
									name='cid'
									value={duty.cid}
									onChange={handleDuty}
									error={error.includes('validate-cid')}
									helperText={error.includes('validate-cid') && VALIDATION_ERROR_SHIPMENT_DUTY.cidRequired}
									disabled={mode === OPERATION_MODE.View}
								/> */}
									<InputLabel required>CID</InputLabel>
									<TextField
										placeholder='ENTER AMOUNT'
										fullWidth
										size={CONTROL_SIZE}
										name='cid'
										value={duty.cid || ''}
										error={error.includes('validate-cid') || error.includes('validate-cid-format')}
										helperText={
											(error.includes('validate-cid') && VALIDATION_ERROR_SHIPMENT_DUTY.cidRequired) ||
											(error.includes('validate-cid-format') && VALIDATION_ERROR_SHIPMENT_DUTY.cidValidation)
										}
										onChange={(e) => {
											handleDuty(e);
											if (error.includes('validate-cid') || error.includes('validate-cid-format')) {
												setError(error.filter((err) => !err.startsWith('validate-cid')));
											}
										}}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
							</Grid>
							<Grid item xs={4}>
								<Stack spacing={0.5}>
									<InputLabel required>VAT</InputLabel>
									<TextField
										placeholder='ENTER AMOUNT'
										fullWidth
										size={CONTROL_SIZE}
										name='vat'
										value={duty.vat || ''}
										error={error.includes('validate-vat') || error.includes('validate-vat-format')}
										helperText={
											(error.includes('validate-vat') && VALIDATION_ERROR_SHIPMENT_DUTY.vatRequired) ||
											(error.includes('validate-vat-format') && VALIDATION_ERROR_SHIPMENT_DUTY.vatValidation)
										}
										onChange={(e) => {
											handleDuty(e);
											if (error.includes('validate-vat') || error.includes('validate-vat-format')) {
												setError(error.filter((err) => !err.startsWith('validate-vat')));
											}
										}}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
							</Grid>
							<Grid item xs={4}>
								<Stack spacing={0.5}>
									<InputLabel required>PAL</InputLabel>
									<TextField
										placeholder='ENTER AMOUNT'
										fullWidth
										size={CONTROL_SIZE}
										name='pal'
										value={duty.pal || ''}
										error={error.includes('validate-pal') || error.includes('validate-pal-format')}
										helperText={
											(error.includes('validate-pal') && VALIDATION_ERROR_SHIPMENT_DUTY.palRequired) ||
											(error.includes('validate-pal-format') && VALIDATION_ERROR_SHIPMENT_DUTY.palValidation)
										}
										onChange={(e) => {
											handleDuty(e);
											if (error.includes('validate-pal') || error.includes('validate-pal-format')) {
												setError(error.filter((err) => !err.startsWith('validate-pal')));
											}
										}}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
							</Grid>
							<Grid item xs={4}>
								<Stack spacing={0.5}>
									<InputLabel required>XID</InputLabel>
									<TextField
										placeholder='ENTER AMOUNT'
										fullWidth
										size={CONTROL_SIZE}
										name='xid'
										value={duty.xid || ''}
										error={error.includes('validate-xid') || error.includes('validate-xid-format')}
										helperText={
											(error.includes('validate-xid') && VALIDATION_ERROR_SHIPMENT_DUTY.xidRequired) ||
											(error.includes('validate-xid-format') && VALIDATION_ERROR_SHIPMENT_DUTY.xidValidation)
										}
										onChange={(e) => {
											handleDuty(e);
											if (error.includes('validate-xid') || error.includes('validate-xid-format')) {
												setError(error.filter((err) => !err.startsWith('validate-xid')));
											}
										}}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
							</Grid>
							<Grid item xs={4}>
								<Stack spacing={0.5}>
									<InputLabel required>EIC</InputLabel>
									<TextField
										placeholder='ENTER AMOUNT'
										fullWidth
										size={CONTROL_SIZE}
										name='eic'
										value={duty.eic || ''}
										error={error.includes('validate-eic') || error.includes('validate-eic-format')}
										helperText={
											(error.includes('validate-eic') && VALIDATION_ERROR_SHIPMENT_DUTY.eicRequired) ||
											(error.includes('validate-eic-format') && VALIDATION_ERROR_SHIPMENT_DUTY.eicValidation)
										}
										onChange={(e) => {
											handleDuty(e);
											if (error.includes('validate-eic') || error.includes('validate-eic-format')) {
												setError(error.filter((err) => !err.startsWith('validate-eic')));
											}
										}}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
							</Grid>
							<Grid item xs={4}>
								<Stack spacing={0.5}>
									<InputLabel required>SSL</InputLabel>
									<TextField
										placeholder='ENTER AMOUNT'
										fullWidth
										size={CONTROL_SIZE}
										name='ssl'
										value={duty.ssl || ''}
										error={error.includes('validate-ssl') || error.includes('validate-ssl-format')}
										helperText={
											(error.includes('validate-ssl') && VALIDATION_ERROR_SHIPMENT_DUTY.sslRequired) ||
											(error.includes('validate-ssl-format') && VALIDATION_ERROR_SHIPMENT_DUTY.sslValidation)
										}
										onChange={(e) => {
											handleDuty(e);
											if (error.includes('validate-ssl') || error.includes('validate-ssl-format')) {
												setError(error.filter((err) => !err.startsWith('validate-ssl')));
											}
										}}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
							</Grid>
							<Grid item xs={4}>
								<Stack spacing={0.5}>
									<InputLabel required>SCL</InputLabel>
									<TextField
										placeholder='ENTER AMOUNT'
										fullWidth
										size={CONTROL_SIZE}
										name='scl'
										value={duty.scl || ''}
										error={error.includes('validate-scl') || error.includes('validate-scl-format')}
										helperText={
											(error.includes('validate-scl') && VALIDATION_ERROR_SHIPMENT_DUTY.sclRequired) ||
											(error.includes('validate-scl-format') && VALIDATION_ERROR_SHIPMENT_DUTY.sclValidation)
										}
										onChange={(e) => {
											handleDuty(e);
											if (error.includes('validate-scl') || error.includes('validate-scl-format')) {
												setError(error.filter((err) => !err.startsWith('validate-scl')));
											}
										}}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
							</Grid>
							<Grid item xs={4}>
								<Stack spacing={0.5}>
									<InputLabel required>PENALTY</InputLabel>
									<TextField
										placeholder='ENTER AMOUNT'
										fullWidth
										size={CONTROL_SIZE}
										name='penalty'
										value={duty.penalty || ''}
										error={error.includes('validate-penalty') || error.includes('validate-penalty-format')}
										helperText={
											(error.includes('validate-penalty') && VALIDATION_ERROR_SHIPMENT_DUTY.penaltyRequired) ||
											(error.includes('validate-penalty-format') && VALIDATION_ERROR_SHIPMENT_DUTY.penaltyValidation)
										}
										onChange={(e) => {
											handleDuty(e);
											if (error.includes('validate-penalty') || error.includes('validate-penalty-format')) {
												setError(error.filter((err) => !err.startsWith('validate-penalty')));
											}
										}}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
							</Grid>
							<Grid item xs={4}>
								<Stack spacing={0.5}>
									<InputLabel required>SURCHARGE</InputLabel>
									<TextField
										placeholder='ENTER AMOUNT'
										fullWidth
										size={CONTROL_SIZE}
										name='surcharge'
										value={duty.surcharge || ''}
										error={error.includes('validate-surcharge') || error.includes('validate-surcharge-format')}
										helperText={
											(error.includes('validate-surcharge') && VALIDATION_ERROR_SHIPMENT_DUTY.surchargeRequired) ||
											(error.includes('validate-surcharge-format') && VALIDATION_ERROR_SHIPMENT_DUTY.surchargeValidation)
										}
										onChange={(e) => {
											handleDuty(e);
											if (error.includes('validate-surcharge') || error.includes('validate-surcharge-format')) {
												setError(error.filter((err) => !err.startsWith('validate-surcharge')));
											}
										}}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
							</Grid>
							<Grid item xs={12}>
								<Stack spacing={0.5}>
									<InputLabel required>Additional Charges</InputLabel>
									<TextField
										placeholder='ENTER AMOUNT'
										fullWidth
										size={CONTROL_SIZE}
										name='additionalCharge'
										value={duty.additionalCharge || ''}
										error={error.includes('validate-additionalCharge') || error.includes('validate-additionalCharge-format')}
										helperText={
											(error.includes('validate-additionalCharge') && VALIDATION_ERROR_SHIPMENT_DUTY.additionalChargesRequired) ||
											(error.includes('validate-additionalCharge-format') && VALIDATION_ERROR_SHIPMENT_DUTY.additionalChargesRequired)
										}
										onChange={(e) => {
											handleDuty(e);
											if (error.includes('validate-additionalCharge') || error.includes('validate-additionalCharge-format')) {
												setError(error.filter((err) => !err.startsWith('validate-additionalCharge')));
											}
										}}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
							</Grid>

							<Grid item xs={12}>
								<Stack spacing={0.5}>
									<InputLabel required>Total Duty Update</InputLabel>
									<TextField
										placeholder='ENTER AMOUNT'
										fullWidth
										size={CONTROL_SIZE}
										name='totalDutyUpdate'
										//value={Duty.totalDutyUpdate}
										value={total}
										//onChange={handleDuty}
										error={error.includes('validate-totalDutyUpdate')}
										helperText={error.includes('validate-totalDutyUpdate') && VALIDATION_ERROR_SHIPMENT_DUTY.totalDutyUpdateRequired}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
							</Grid>
							<Grid item xs={12}>
								<Stack spacing={0.5}>
									<InputLabel required>Submitted Date To Finance</InputLabel>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DatePicker
											inputFormat='dd/MM/yyyy'
											value={duty.submittedDateToFinance || ''}
											onChange={(newValue) => handleDatePickerChange('submittedDateToFinance', newValue)}
											disabled={mode === OPERATION_MODE.View}
											renderInput={(params) => (
												<TextField
													{...params}
													size={CONTROL_SIZE}
													error={error.includes('validate-submittedDateToFinance')}
													helperText={error.includes('validate-submittedDateToFinance') && VALIDATION_ERROR_SHIPMENT_DUTY.submittedDateToFinanceRequired}
												/>
											)}
										/>
									</LocalizationProvider>
								</Stack>
							</Grid>
							<Grid item xs={12}>
								<Stack spacing={0.5}>
									<InputLabel required>Payment Date</InputLabel>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DatePicker
											inputFormat='dd/MM/yyyy'
											value={duty.paymentDate || ''}
											onChange={(newValue) => handleDatePickerChange('paymentDate', newValue)}
											disabled={mode === OPERATION_MODE.View}
											renderInput={(params) => (
												<TextField
													{...params}
													size={CONTROL_SIZE}
													error={error.includes('validate-paymentDate')}
													helperText={error.includes('validate-paymentDate') && VALIDATION_ERROR_SHIPMENT_DUTY.paymentDateRequired}
												/>
											)}
										/>
									</LocalizationProvider>
								</Stack>
							</Grid>
							<Grid item xs={12}>
								<Stack spacing={0.5}>
									<InputLabel required>Payment Reference</InputLabel>
									<TextField
										placeholder='Enter The Payment references'
										fullWidth
										size={CONTROL_SIZE}
										name='paymentReference'
										value={duty.paymentReference || ''}
										onChange={handleDuty}
										error={error.includes('validate-paymentReference')}
										helperText={error.includes('validate-paymentReference') && VALIDATION_ERROR_SHIPMENT_DUTY.paymentReferenceRequired}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
								<Stack spacing={0.5}>
									<InputLabel required>Remarks</InputLabel>
									<TextField
										placeholder='Enter The Remarks'
										fullWidth
										size={CONTROL_SIZE}
										name='remarks'
										value={duty.remarks || ''}
										onChange={handleDuty}
										error={error.includes('validate-remarks')}
										helperText={error.includes('validate-remarks') && VALIDATION_ERROR_SHIPMENT_DUTY.remarkRequired}
										disabled={mode === OPERATION_MODE.View}
									/>
								</Stack>
							</Grid>
						</Grid>
					</MainCard>
				</>
			)}
		</>
	);
}

DutyForm.propTypes = {
	isFetching: PropTypes.bool,
};
