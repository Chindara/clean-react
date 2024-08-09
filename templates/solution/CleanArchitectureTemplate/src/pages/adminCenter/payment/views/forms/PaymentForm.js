import React, { useId } from 'react';
import PropTypes from 'prop-types';

// MUI
import { Grid, TextField, InputLabel, Stack, Box, Skeleton } from '@mui/material';

// CONTEXTS
import { usePayment } from 'pages/adminCenter/payment/contexts/PaymentContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { PAYMENT_ERROR } from 'constants/ValidationMessage';

// ==============================|| PAYMENT FORM ||============================== //

export default function PaymentForm({ isFetching }) {
	const id = useId();
	const { payment, setPayment, error, setError, mode } = usePayment();

	const handlePayment = (event) => {
		const { name, value } = event.target;

		let errorList = error;
		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		setPayment({ ...payment, [name]: value });
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
				<Grid container spacing={2} justifyContent={'center'} padding={2}>
					<Grid container item xs={12} spacing={2}>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<Stack spacing={1} direction='row'>
									<InputLabel required>Name</InputLabel>
								</Stack>
								<TextField
									id={`name-${id}`}
									name='name'
									size='small'
									value={payment.name}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter Name'
									fullWidth
									error={error.includes('validate-name')}
									helperText={error.includes('validate-name') && PAYMENT_ERROR.nameRequired}
									onChange={handlePayment}
								/>
							</Stack>
						</Grid>
					</Grid>
				</Grid>
			)}
		</>
	);
}

PaymentForm.propTypes = {
	isFetching: PropTypes.bool,
};
