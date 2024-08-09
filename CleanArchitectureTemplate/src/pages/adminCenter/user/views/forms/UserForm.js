import React, { useId, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// MUI
import { Grid, TextField, InputLabel, Stack, Box, Skeleton, Autocomplete, Select, MenuItem, FormControl, CircularProgress, FormHelperText } from '@mui/material';

// CONTEXTS
import { useUser } from 'pages/adminCenter/user/contexts/UserContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { USER_ERROR } from 'constants/ValidationMessage';
import { CONTROL_SIZE } from 'constants/Common';
import LookupService from 'services/LookupService';
import useAuth from 'hooks/useAuth';
import MainCard from 'components/MainCard';

// ==============================|| USER FORM ||============================== //

export default function UserForm({ isFetching }) {
	const id = useId();
	const { user, setUser, error, setError, mode } = useUser();
	const { companyId, userType } = useAuth();
	const [roleChoices, setRoleChoices] = useState([]);

	useEffect(() => {
		(async () => {
			try {
				const { data = [] } = await LookupService.getRoles(companyId);

				const userRoles = data.reduce((accumulator, object) => [...accumulator, { label: object.name, value: object.id }], []);

				setRoleChoices(userRoles);
				console.log('hello', data);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	const handleUser = (event) => {
		const { name, value } = event.target;

		let errorList = error;
		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		setUser({ ...user, [name]: value });
	};

	const handleAutoComplete = (value) => {

		let errorList = [...error];
		let valueIndex = errorList.indexOf('validate-roles');

		setUser((prevState) => ({ ...prevState, roles: value }));
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
									<InputLabel required>First Name</InputLabel>
								</Stack>
								<TextField
									name='firstName'
									value={user.firstName}
									size={CONTROL_SIZE}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter First Name'
									fullWidth
									error={error.includes('validate-firstName')}
									helperText={error.includes('validate-firstName') && USER_ERROR.firstNameRequired}
									onChange={handleUser}
								/>
							</Stack>
						</Grid>		
						<Grid item xs={12}>
							<Stack spacing={0.5}>
							<Stack spacing={1} direction='row'>
									<InputLabel required>Last Name</InputLabel>
								</Stack>
								<TextField
									name='lastName'
									size={CONTROL_SIZE}
									value={user.lastName}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter Last Name'
									fullWidth
									error={error.includes('validate-lastName')}
									helperText={error.includes('validate-lastName') && USER_ERROR.lastNameRequired}
									onChange={handleUser}
								/>
							</Stack>
						</Grid>		
						<Grid item xs={12}>
							<Stack spacing={0.5}>
							<Stack spacing={1} direction='row'>
									<InputLabel required>Mobile Number</InputLabel>
								</Stack>
								<TextField
									name='mobile'
									size={CONTROL_SIZE}
									value={user.mobile}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter Mobile Number'
									fullWidth
									error={error.includes('validate-mobile') || error.includes('validate-mobile-format')}
									helperText={error.includes('validate-mobile') && USER_ERROR.mobileRequired || error.includes('validate-mobile-format') && USER_ERROR.mobileValidation}
									onChange={(e) => {
										handleUser(e);
										if (error.includes('validate-mobile') || error.includes('validate-mobile-format')) {
											setError(error.filter(err => !err.startsWith('validate-mobile')));
										}
									}}								/>
							</Stack>
						</Grid>		
						<Grid item xs={12}>
							<Stack spacing={0.5}>
							<Stack spacing={1} direction='row'>
									<InputLabel required>Email</InputLabel>
								</Stack>
								<TextField
									name='email'
									size={CONTROL_SIZE}
									value={user.email}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter Email'
									fullWidth
									error={error.includes('validate-email')|| error.includes('validate-email-format')}
									helperText={error.includes('validate-email') && USER_ERROR.emailRequired || error.includes('validate-email-format') && USER_ERROR.emailValidation}
									onChange={(e) => {
										handleUser(e);
										if (error.includes('validate-email') || error.includes('validate-email-format')) {
											setError(error.filter(err => !err.startsWith('validate-email')));
										}
									}}								/>
							</Stack>
						</Grid>		
						<Grid item xs={12}>
							<Stack spacing={0.5}>
							<Stack spacing={1} direction='row'>
									<InputLabel required>Roles</InputLabel>
								</Stack>
								<Autocomplete
									multiple
									id='roles'
									options={roleChoices}
									getOptionLabel={(option) => option.label}
									disabled={mode === OPERATION_MODE.View}
									filterSelectedOptions
									isOptionEqualToValue={(option, value) => option?.value === value?.value}
									value={user.roles}
									noOptionsText={'No Results'}
									clearOnBlur
									onChange={(event, value) => handleAutoComplete(value)}
									renderInput={(params) => (
										<TextField
											{...params}
											placeholder='Select Role'
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
											error={error.includes('validate-roles')}
											helperText={error.includes('validate-roles') && USER_ERROR.roleRequired}
										/>
									)}
								/>
							</Stack>
						</Grid>		
						<Grid item xs={12}>
							<Stack spacing={0.5}>
							{userType === 2 && (
									<>
									<Stack spacing={1} direction='row'>
										<InputLabel required>User Type</InputLabel>
									</Stack>
									<FormControl fullWidth>
										<Select
											variant='outlined'
											size={CONTROL_SIZE}
											name='userType'
											value={user.userType}
											onChange={(event) => handleUser(event, 'userType')}
											error={error.includes('validate-userType')}
											displayEmpty
											disabled={mode === OPERATION_MODE.View}
										>
											<MenuItem disabled value=''>
												Select User Type
											</MenuItem>
											<MenuItem value={2}>ADMIN</MenuItem>
											<MenuItem value={3}>OFFICER</MenuItem>
										</Select>
										{error.includes('validate-userType') && <FormHelperText error>{USER_ERROR.userTypeRequired}</FormHelperText>}
									</FormControl>
									</>
								)}
							</Stack>
						</Grid>		
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								{mode !== OPERATION_MODE.Create && (user.status === 2 || user.status === 3) && (
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
												value={user.status}
												onChange={(event) => handleUser(event, 'status')}
												//error={error.includes('validate-natureOfPurchase')}
												displayEmpty
												disabled={mode === OPERATION_MODE.View}
												//renderInput={(params) => <TextField {...params} placeholder='Select Status' />}
											>
												<MenuItem value={2}>Active</MenuItem>
												<MenuItem value={3}>Inactive</MenuItem>
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
UserForm.propTypes = {
	isFetching: PropTypes.bool,
};
