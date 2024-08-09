import React from 'react';
// import PropTypes from 'prop-types';

// MUI
import {
	Autocomplete,
	Box,
	// Button,
	CardHeader,
	Divider,
	Grid,
	InputLabel,
	Stack,
	TextField,
	CircularProgress,
} from '@mui/material';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// THIRD-PARTY
import { useQuery } from '@tanstack/react-query';

// PROJECT IMPORT
// import MainCard from 'components/MainCard';

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

export default function BankFormTT() {
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

		setPurchaseOrderBank((prevState) => ({ ...prevState, TT: { ...prevState.TT, [name]: value } }));
	};

	const handleDatePickerChange = (property, value) => {
		let errorList = error;
		let errorIndex = errorList.indexOf(`validate-${property}`);
		if (errorIndex !== -1) errorList.splice(errorIndex, 1);
		setError(errorList);

		setPurchaseOrderBank((prevState) => ({ ...prevState, TT: { ...prevState.TT, [property]: value } }));
	};

	const handleAutoCompleteChange = (value) => {
		let errorList = [...error];
		let valueIndex = errorList.indexOf('validate-bank');

		setPurchaseOrderBank((prevState) => ({ ...prevState, TT: { ...prevState.TT, bank: value } }));
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
							// freeSolo
							// forcePopupIcon
							loading={isFetching}
							options={bankOptions}
							getOptionLabel={(option) => option.label}
							isOptionEqualToValue={(option, value) => option.value === value.value}
							autoHighlight
							filterSelectedOptions
							value={bankOptions.find((option) => option?.value === purchaseOrderBank.TT.bank?.value) || null}
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
						<InputLabel>Bank Reference</InputLabel>
						<TextField name='bankReference' placeholder='Enter Bank Reference' fullWidth size={CONTROL_SIZE} value={purchaseOrderBank.TT.bankReference} onChange={handleOnChange} />
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Received to SD</InputLabel>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								inputFormat='dd/MM/yyyy'
								value={purchaseOrderBank.TT.receivedToSD}
								onChange={(newValue) => handleDatePickerChange('receivedToSD', newValue)}
								renderInput={(params) => <TextField {...params} />}
							/>
						</LocalizationProvider>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel required>TT Request Date</InputLabel>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								inputFormat='dd/MM/yyyy'
								value={purchaseOrderBank.TT.ttRequested}
								onChange={(newValue) => handleDatePickerChange('ttRequested', newValue)}
								renderInput={(params) => (
									<TextField
										{...params}
										error={error.includes('validate-ttRequested')}
										helperText={error.includes('validate-ttRequested') && PURCHASE_ORDER_BANK_ERROR.ttRequestDateRequired}
									/>
								)}
							/>
						</LocalizationProvider>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Advance Amount</InputLabel>
						<TextField
							name='advanceAmount'
							type='number'
							placeholder='Enter Advance Amount'
							fullWidth
							size={CONTROL_SIZE}
							value={purchaseOrderBank.TT.advanceAmount}
							onChange={handleOnChange}
						/>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Advance Paid Date</InputLabel>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								inputFormat='dd/MM/yyyy'
								value={purchaseOrderBank.TT.advancePaidDate}
								onChange={(newValue) => handleDatePickerChange('advancePaidDate', newValue)}
								renderInput={(params) => <TextField {...params} />}
							/>
						</LocalizationProvider>
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
							value={purchaseOrderBank.TT.balanceAmount}
							onChange={handleOnChange}
						/>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Balance Paid Date</InputLabel>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								inputFormat='dd/MM/yyyy'
								value={purchaseOrderBank.TT.balancePaidDate}
								onChange={(newValue) => handleDatePickerChange('balancePaidDate', newValue)}
								renderInput={(params) => <TextField {...params} />}
							/>
						</LocalizationProvider>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Stack spacing={0.5}>
						<InputLabel>Remark</InputLabel>
						<TextField name='remark' multiline rows={3} placeholder='Enter Remark' fullWidth size={CONTROL_SIZE} value={purchaseOrderBank.TT.remark} onChange={handleOnChange} />
					</Stack>
				</Grid>
			</Grid>
		</>
	);
}
