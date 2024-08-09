import React, { useId } from 'react';
import PropTypes from 'prop-types';

// MUI
import { Grid, TextField, InputLabel, Stack, Box, Skeleton, FormControl, MenuItem, Select, FormHelperText, Typography } from '@mui/material';

// CONTEXTS
import { useSubPaymentMethod } from 'pages/adminCenter/subPaymentMethod/contexts/SubPaymentMethodContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { SUB_PAYMENT_METHOD_ERROR } from 'constants/ValidationMessage';
import { CONTROL_SIZE } from 'constants/Common';
import MainCard from 'components/MainCard';

// ==============================|| PAYMENT METHOD FORM ||============================== //

export default function SubPaymentMethodForm({ isFetching }) {
	const id = useId();
	const { subPaymentMethod, setSubPaymentMethod, error, setError, mode } = useSubPaymentMethod();

	const onChange = (event) => {
		console.log(event.target.name);
		const { name, value } = event.target;

		let errorList = error;
		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		setSubPaymentMethod({ ...subPaymentMethod, [name]: value });
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
								<InputLabel required>Payment Method</InputLabel>
								<FormControl fullWidth>
									<Select
										variant='outlined'
										size={CONTROL_SIZE}
										name='type'
										value={subPaymentMethod.type || ''}
										onChange={onChange}
										disabled={mode === OPERATION_MODE.View}
										error={error.includes('validate-type')}
										displayEmpty
									>
										<MenuItem value='' disabled>
											<Typography variant='inherit' color='textSecondary'>
												Choose Payment Method
											</Typography>
										</MenuItem>
										<MenuItem value={1}>TT</MenuItem>
										<MenuItem value={2}>DA</MenuItem>
										<MenuItem value={3}>DP</MenuItem>
										<MenuItem value={4}>OA</MenuItem>
										<MenuItem value={5}>LC</MenuItem>
									</Select>
									{error.includes('validate-type') && <FormHelperText error>{SUB_PAYMENT_METHOD_ERROR.paymentMethodRequired}</FormHelperText>}
								</FormControl>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<InputLabel required>Name</InputLabel>
								<TextField
									id={`name-${id}`}
									name='name'
									size={CONTROL_SIZE}
									value={subPaymentMethod.name}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter Name'
									fullWidth
									error={error.includes('validate-name')}
									helperText={error.includes('validate-name') && SUB_PAYMENT_METHOD_ERROR.nameRequired}
									onChange={onChange}
								/>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								{mode !== OPERATION_MODE.Create && (
									<Grid item xs={12}>
										<Stack spacing={0.5}>
											<InputLabel required>Status</InputLabel>
											<FormControl fullWidth>
												<Select
													variant='outlined'
													size={CONTROL_SIZE}
													//options={statusChoices}
													name='status'
													value={subPaymentMethod.status}
													onChange={onChange}
													//error={error.includes('validate-natureOfPurchase')}
													displayEmpty
													disabled={mode === OPERATION_MODE.View}
													//renderInput={(params) => <TextField {...params} placeholder='Select Status' />}
												>
													<MenuItem value={1}>Active</MenuItem>
													<MenuItem value={2}>Inactive</MenuItem>
												</Select>
												{/* {error.includes('validate-natureOfPurchase') && (
									<FormHelperText error>{VALIDATION_ERROR.natureOfPurchaseRequired}</FormHelperText>
								)} */}
											</FormControl>
										</Stack>
									</Grid>
								)}
							</Stack>
						</Grid>
					</Grid>
				</MainCard>
			)}
		</>
	);
}

SubPaymentMethodForm.propTypes = {
	isFetching: PropTypes.bool,
};
