import React, { useId } from 'react';
import PropTypes from 'prop-types';

// MUI
import { Grid, TextField, InputLabel, Stack, Box, Skeleton, FormControl, MenuItem, Select } from '@mui/material';

// CONTEXTS
import { useShipmentPaymentType } from 'pages/adminCenter/shipmentPaymentType/contexts/ShipmentPaymentTypeContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { SHIPMENT_PAYMENT_TYPE_ERROR } from 'constants/ValidationMessage';
import { CONTROL_SIZE } from 'constants/Common';
import MainCard from 'components/MainCard';

// ==============================|| BANK FORM ||============================== //

export default function ShipmentPaymentTypeForm({ isFetching }) {
	const id = useId();
	const { shipmentPaymentType, setShipmentPaymentType, error, setError, mode } = useShipmentPaymentType();

	const handleShipmentPaymentType = (event) => {
		const { name, value } = event.target;

		let errorList = error;
		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		setShipmentPaymentType({ ...shipmentPaymentType, [name]: value });
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
							<Stack spacing={0.5}>
								<Stack spacing={1} direction='row'>
									<InputLabel required>Name</InputLabel>
								</Stack>
								<TextField
									id={`name-${id}`}
									name='name'
									size={CONTROL_SIZE}
									value={shipmentPaymentType.name}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter Name'
									fullWidth
									error={error.includes('validate-name')}
									helperText={error.includes('validate-name') && SHIPMENT_PAYMENT_TYPE_ERROR.nameRequired}
									onChange={handleShipmentPaymentType}
								/>
							</Stack>
							</Stack>
						</Grid>								
						<Grid item xs={12}>
							<Stack spacing={0.5}>
							{mode !== OPERATION_MODE.Create && (
								<>
									<Stack spacing={1} direction='row'>
										<InputLabel required>Status</InputLabel>
									</Stack>
									<FormControl fullWidth>
										<Select
											variant='outlined'
											size={CONTROL_SIZE}
											//options={statusChoices}
											name='status'
											value={shipmentPaymentType.status}
											onChange={handleShipmentPaymentType}
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
								</>
							)}
							</Stack>
						</Grid>															
					</Grid>
				</MainCard>
			)}
		</>
	);
}

ShipmentPaymentTypeForm.propTypes = {
	isFetching: PropTypes.bool,
};
