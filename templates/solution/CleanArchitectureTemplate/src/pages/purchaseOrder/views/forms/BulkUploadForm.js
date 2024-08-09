import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Grid,
	TextField,
	InputLabel,
	Stack,
	Button,
	MenuItem,
	FormControl,
	FormHelperText,
	Select,
	Autocomplete,
	InputAdornment,
	IconButton,
	Typography,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper,
	Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useBulkUpload } from '../../contexts/BulkUploadContext';
import { VALIDATION_ERROR } from 'constants/ValidationMessage';
import LookupService from 'services/LookupService';
import BulkUploadService from 'services/BulkUploadService';
import { CONTROL_SIZE } from 'constants/Common';
import useAuth from 'hooks/useAuth';
import { useDebouncedCallback } from 'use-debounce';
import { setAlertError, setAlertSuccess } from 'components/alert/Alert';
import { BULK_UPLOAD_ALERT } from 'constants/AlertMessage';
import { isEmpty } from 'validations/validation';
import { OPERATION_MODE } from 'constants/Types';
import { useQueryClient } from '@tanstack/react-query';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PurchaseOrderService from 'services/PurchaseOrderService';
import SaveIcon from '@mui/icons-material/Save';

export default function BulkUploadForm({ availability, setAvailability }) {
	const theme = useTheme();
	const { userId, companyId } = useAuth();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { bulkUpload, setBulkUpload, resetBulkUploadForm, error, setError, mode, setLoader } = useBulkUpload();
	const [entityChoices, setEntityChoices] = useState([]);
	const [userChoices, setUserChoices] = useState([]);
	const [natureOfPurchaseChoices, setNatureOfPurchase] = useState([]);
	const [subPaymentMethodChoices, setSubPaymentMethod] = useState([]);
	const [errorMessages, setErrorMessages] = useState([]);
	const [errorCount, setErrorCount] = useState(0);

	const [loading, setLoading] = useState(false);

	const [selectedFile, setSelectedFile] = useState(null);
	const [inputKey, setInputKey] = useState(Date.now());
	const [availabilityLoader, setAvailabilityLoader] = useState(false);

	const VisuallyHiddenInput = styled('input')({
		clip: 'rect(0 0 0 0)',
		clipPath: 'inset(50%)',
		height: 1,
		overflow: 'hidden',
		position: 'absolute',
		bottom: 0,
		left: 0,
		whiteSpace: 'nowrap',
		width: 1,
	});

	const debounced = useDebouncedCallback(async () => {
		await checkAvailability();
		setAvailabilityLoader(false);
	}, 1000);

	const checkAvailability = async () => {
		try {
			const { data: { record } = {} } = await BulkUploadService.isExists(companyId, bulkUpload.file);

			setAvailability(record);
		} catch (error) {
			setAlertError(BULK_UPLOAD_ALERT.Error.CheckAvailability);
		}
	};

	const debounceHandler = () => {
		setAvailabilityLoader(true);
		debounced();
	};

	useEffect(() => {
		(async () => {
			try {
				const getEntities = LookupService.getEntities(companyId);
				const getUsers = LookupService.getUsers(companyId);
				const getNatureOfPurchase = LookupService.getNatureOfPurchase(companyId);
				const getSubPaymentMethod = LookupService.getSubPaymentMethod(companyId);

				const [entities = [], users = [], natureOfPurchase = [], subPaymentMethod = []] = await Promise.all([getEntities, getUsers, getNatureOfPurchase, getSubPaymentMethod]);

				setEntityChoices(entities?.data);
				setUserChoices(users?.data);
				setNatureOfPurchase(natureOfPurchase?.data);
				setSubPaymentMethod(subPaymentMethod?.data);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [companyId]);

	const onChange = (event) => {
		const { name, value } = event.target;

		if (name === 'file') {
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

		setBulkUpload({ ...bulkUpload, [name]: value });
	};

	const handleChange = (event) => {
		const { name, value, files } = event.target;
		if (files && files[0]) {
			setSelectedFile(files[0]);
			setInputKey(Date.now());
			onChange({ target: { name: 'file', value: files[0].name } });
		} else {
			onChange({ target: { name, value } });
		}
	};

	const handleClear = () => {
		setSelectedFile(null);
		onChange({ target: { name: 'file', value: '' } });
		setInputKey(Date.now());
		setErrorMessages([]);
	};

	const validateBulkUploadForm = () => {
		const errorList = [];
		const properties = ['file', 'entity', 'natureOfPurchase', 'buyer', 'user', 'paymentMethod'];

		properties.forEach((property) => {
			if (!bulkUpload[property]) {
				errorList.push(`validate-${property}`);
			}
		});

		setError(errorList);

		return errorList.length === 0;
	};

	const handleSubmit = async () => {
		const isBulkUploadValid = validateBulkUploadForm(bulkUpload, setError);

		if (isBulkUploadValid) {
			setLoader(true);
			setLoading(true);
			const formData = new FormData();
			formData.append('file', selectedFile);
			formData.append('companyId', companyId);
			formData.append('userId', userId);
			formData.append('entity', bulkUpload.entity);
			formData.append('natureOfPurchase', bulkUpload.natureOfPurchase);
			formData.append('buyer', bulkUpload.buyer);
			formData.append('user', bulkUpload.user);
			formData.append('paymentMethod', bulkUpload.paymentMethod);

			const entity = bulkUpload.entity;
			const natureOfPurchase = bulkUpload.natureOfPurchase;
			const buyer = bulkUpload.buyer;
			const user = bulkUpload.user;
			const paymentMethod = bulkUpload.paymentMethod;

			try {
				const { isSuccess, errors } = await PurchaseOrderService.createBulk(companyId, userId, entity, natureOfPurchase, buyer, user, paymentMethod, formData);

				if (!isSuccess) {
					let errorMessages = [];
					// for (const key in errors) {
					// 	errors[key].forEach(errorMessage => {
					// 		errorMessages.push({ row: key, message: errorMessage });
					// 	});
					// }
					for (const key in errors) {
						const errorMessage = errors[key].join(', ');
						errorMessages.push({ row: key, message: errorMessage });
					}

					setErrorMessages(errorMessages);
					setErrorCount(errorMessages.length);
					setAlertError(BULK_UPLOAD_ALERT.Error.UploadFailed);
					console.log('Upload errors:', errorMessages);
				} else {
					queryClient.invalidateQueries({ queryKey: ['purchaseOrder'] });
					resetBulkUploadForm();
					setAlertSuccess(BULK_UPLOAD_ALERT.Success.BulkUploadCreated);

					setErrorMessages([]);
					navigate('/purchaseOrders');
				}
			} catch (error) {
				console.error('Upload error:', error);
				setAlertError(BULK_UPLOAD_ALERT.Error.UploadFailed);
			} finally {
				setTimeout(() => {
					setLoader(false);
					setLoading(false);
				}, 2200);
			}
		}
	};

	return (
		<>
			<Grid container spacing={2} justifyContent='flex-end'>
				<Grid container item spacing={1}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={0.5}>
							<InputLabel required>Purchase Orders</InputLabel>
							{/* <TextField
								variant='outlined'
								placeholder='Choose file'
								error={error.includes('validate-file')}
								helperText={error.includes('validate-file') ? VALIDATION_ERROR.fileRequired : ''}
								disabled={mode === OPERATION_MODE.View}
								value={bulkUpload.file || ''}
								onChange={handleChange}
								fullWidth
								InputProps={{
									endAdornment: (
										<InputAdornment position='end'>
											<IconButton onClick={handleClear}>
												<DeleteTwoToneIcon />
											</IconButton>
											<input key={inputKey} accept='*' id='file-input' type='file' style={{ display: 'none' }} onChange={handleChange} />
											<label htmlFor='file-input'>
												<Button variant='contained' component='span' onClick={handleClear}>
													Select File
												</Button>
											</label>
										</InputAdornment>
									),
								}}
							/> */}
							<TextField
								variant='outlined'
								placeholder='Select file'
								error={error.includes('validate-file')}
								helperText={error.includes('validate-file') ? VALIDATION_ERROR.fileRequired : ''}
								disabled={mode === OPERATION_MODE.View}
								value={bulkUpload.file || ''}
								onChange={handleChange}
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<Button component='label' role={undefined} variant='contained' tabIndex={-1} style={{ borderRadius: '4px 0 0 4px', left: '-14px', height: '40px' }}>
												Select File
												<input key={inputKey} accept='*' id='file-input' type='file' style={{ display: 'none' }} onChange={handleChange} />
											</Button>
										</InputAdornment>
									),
									endAdornment: bulkUpload.file && (
										<InputAdornment position='end'>
											<IconButton onClick={handleClear}>
												<ClearOutlinedIcon />
											</IconButton>
										</InputAdornment>
									),
								}}
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
								value={entityChoices.find((option) => option.id === bulkUpload.entity) || null}
								onChange={(event, value) => onChange({ target: { name: 'entity', value: value ? value.id : null } })}
								renderInput={(params) => (
									<TextField
										{...params}
										variant='outlined'
										placeholder='Choose Entity'
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
								value={natureOfPurchaseChoices.find((option) => option.id === bulkUpload.natureOfPurchase) || null}
								onChange={(event, value) => onChange({ target: { name: 'natureOfPurchase', value: value ? value.id : null } })}
								renderInput={(params) => (
									<TextField
										{...params}
										variant='outlined'
										placeholder='Choose Nature of Purchase'
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
							<InputLabel required>Buyer</InputLabel>
							<FormControl fullWidth>
								<Select
									variant='outlined'
									size={CONTROL_SIZE}
									name='buyer'
									value={bulkUpload.buyer || ''}
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
								<Select variant='outlined' size={CONTROL_SIZE} name='user' value={bulkUpload.user || ''} onChange={onChange} error={error.includes('validate-user')} displayEmpty>
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
							<InputLabel required>Payment Method</InputLabel>
							<FormControl fullWidth>
								<Select
									variant='outlined'
									size={CONTROL_SIZE}
									name='paymentMethod'
									value={bulkUpload.paymentMethod || ''}
									onChange={onChange}
									error={error.includes('validate-paymentMethod')}
									displayEmpty
								>
									<MenuItem disabled value='' key='placeholder'>
										<Typography variant='inherit' color='textSecondary'>
											Choose Payment Method
										</Typography>
									</MenuItem>
									{subPaymentMethodChoices.map(({ name, id }) => (
										<MenuItem key={id} value={id}>
											{name}
										</MenuItem>
									))}
								</Select>
								{error.includes('validate-paymentMethod') && <FormHelperText error>{VALIDATION_ERROR.paymentMethodRequired}</FormHelperText>}
							</FormControl>
						</Stack>
					</Grid>
				</Grid>
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
								<LoadingButton variant='contained' color='primary' onClick={handleSubmit} loading={loading}>
									Upload
								</LoadingButton>
							</Stack>
						</Stack>
					</Grid>
				</Grid>
				{errorMessages.length > 0 && (
					<Grid container item spacing={1}>
						<Grid item xs={12} sm={12}>
							<Stack spacing={0.5}>
								<Typography variant='subtitle1' color='error'>
									Errors: {errorCount}
								</Typography>
								<TableContainer component={Paper}>
									<Table size='small'>
										<TableHead>
											<TableRow>
												<TableCell>Row No</TableCell>
												<TableCell>Error Message</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{errorMessages.map((error, index) => (
												<TableRow key={index}>
													<TableCell>{error.row}</TableCell>
													<TableCell>{error.message}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							</Stack>
						</Grid>
					</Grid>
				)}{' '}
			</Grid>
		</>
	);
}

BulkUploadForm.propTypes = {
	availability: PropTypes.bool.isRequired,
	setAvailability: PropTypes.func.isRequired,
};
