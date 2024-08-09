import React, { useId } from 'react';
import PropTypes from 'prop-types';

// MUI
import { Grid, TextField, InputLabel, Stack, Box, Skeleton, FormControl, Select, MenuItem } from '@mui/material';

// CONTEXTS
import { useCountry } from 'pages/adminCenter/country/contexts/CountryContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { COUNTRY_ERROR } from 'constants/ValidationMessage';
import { CONTROL_SIZE } from 'constants/Common';

// ==============================|| COUNTRY FORM ||============================== //

export default function CountryForm({ isFetching }) {
	const id = useId();
	const { country, setCountry, error, setError, mode } = useCountry();

	const handleCountry = (event) => {
		const { name, value } = event.target;

		let errorList = error;
		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		setCountry({ ...country, [name]: value });
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
									size={CONTROL_SIZE}
									value={country.name}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter Name'
									fullWidth
									error={error.includes('validate-name')}
									helperText={error.includes('validate-name') && COUNTRY_ERROR.nameRequired}
									onChange={handleCountry}
								/>
							</Stack>
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
											value={country.status}
											onChange={handleCountry}
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
						</Grid>
					</Grid>
				</Grid>
			)}
		</>
	);
}

CountryForm.propTypes = {
	isFetching: PropTypes.bool,
};
