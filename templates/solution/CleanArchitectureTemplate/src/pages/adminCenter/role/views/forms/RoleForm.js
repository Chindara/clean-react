import React, { useId, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// MUI
import { Grid, TextField, InputLabel, Stack, Box, Skeleton, Autocomplete, MenuItem, Select, FormControl, CircularProgress } from '@mui/material';

// CONTEXTS
import { useRole } from 'pages/adminCenter/role/contexts/RoleContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { ROLE_ERROR } from 'constants/ValidationMessage';
import { CONTROL_SIZE } from 'constants/Common';
import LookupService from 'services/LookupService';
import MainCard from 'components/MainCard';

// ==============================|| ROLE FORM ||============================== //

export default function RoleForm({ isFetching }) {
	const id = useId();
	const { role, setRole, error, setError, mode } = useRole();

	const [functionChoices, setFunctionChoices] = useState([]);

	useEffect(() => {
		(async () => {
			try {
				const { data = [] } = await LookupService.getFunctions(2);

				const roleFunctions = data.reduce((accumulator, object) => [...accumulator, { label: object.name, value: object.id }], []);

				setFunctionChoices(roleFunctions);
				console.log('hello', data);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	const handleRole = (event) => {
		const { name, value } = event.target;

		let errorList = error;
		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		setRole({ ...role, [name]: value });
	};

	const handleAutoComplete = (value) => {
		console.log(value);

		let errorList = [...error];
		let valueIndex = errorList.indexOf('validate-function');

		setRole((prevState) => ({ ...prevState, function: value }));
		if (valueIndex !== -1) errorList.splice(valueIndex, 1) && setError(errorList);

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
							<Stack spacing={1} direction='row'>
									<InputLabel required>Name</InputLabel>
								</Stack>
								<TextField
									id={`name-${id}`}
									name='name'
									size={CONTROL_SIZE}
									value={role.name}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter Name'
									fullWidth
									error={error.includes('validate-name')}
									helperText={error.includes('validate-name') && ROLE_ERROR.nameRequired}
									onChange={handleRole}
								/>
							</Stack>
						</Grid>										
						<Grid item xs={12}>
							<Stack spacing={0.5}>
							<Stack spacing={1} direction='row'>
									<InputLabel required>Functions</InputLabel>
								</Stack>
								<Autocomplete
									multiple
									id='functions'
									options={functionChoices}
									getOptionLabel={(option) => option.label}
									disabled={mode === OPERATION_MODE.View}
									filterSelectedOptions
									isOptionEqualToValue={(option, value) => option?.value === value?.value}
									value={role.function}
									noOptionsText={'No Results'}
									clearOnBlur
									onChange={(event, value) => handleAutoComplete(value)}
									renderInput={(params) => (
										<TextField
											{...params}
											placeholder='Select Function'
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
											error={error.includes('validate-function')}
											helperText={error.includes('validate-function') && ROLE_ERROR.functionRequired}
										/>
										)}
								/>
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
												value={role.status}
												onChange={handleRole}
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

RoleForm.propTypes = {
	isFetching: PropTypes.bool,
};
