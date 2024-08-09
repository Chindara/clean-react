import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

// material-ui
import { Button, Checkbox, Divider, FormControlLabel, FormHelperText, Grid, Link, InputAdornment, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';

// project import
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import FirebaseSocial from './FirebaseSocial';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { AUTH_STATE } from 'common/state/auth-state';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
	// const navigate = useNavigate();
	const { login } = useAuth();

	const [checked, setChecked] = useState(false);
	const [capsWarning, setCapsWarning] = useState(false);
	const [currentUser, setCurrentUser] = useState(AUTH_STATE);
	const [emptyFieldsError, setEmptyFieldsError] = useState(false);
	const [wrongCredentialsError, setWrongCredentialsError] = useState(false);

	// const { isLoggedIn, firebaseEmailPasswordSignIn } = useAuth();
	const scriptedRef = useScriptRef();

	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const onKeyDown = (keyEvent) => {
		if (keyEvent.getModifierState('CapsLock')) {
			setCapsWarning(true);
		} else {
			setCapsWarning(false);
		}
	};

	const handleChange = (event) => {
		const { name, value } = event.target;

		// let errorList = error;
		// if (name) {
		// 	let errorIndex = errorList.indexOf(`validate-${name}`);
		// 	if (errorIndex !== -1) errorList.splice(errorIndex, 1);
		// 	setError(errorList);
		// }

		setCurrentUser({ ...currentUser, [name]: value });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!currentUser.username || !currentUser.password) {
			setEmptyFieldsError(true);
			setWrongCredentialsError(false); // Ensure wrong credentials error is cleared
			return;
		}

		try {
			await login(currentUser.username, currentUser.password);

			if (localStorage.isLogin) {
				setEmptyFieldsError(false);
				setWrongCredentialsError(false);
			} else {
				setWrongCredentialsError(true);
				setEmptyFieldsError(false); // Ensure empty fields error is cleared
			}
		} catch (error) {
			setWrongCredentialsError(true);
			setEmptyFieldsError(false); // Ensure empty fields error is cleared
		}
	};

	return (
		<>
			<form noValidate onSubmit={handleSubmit}>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<Stack spacing={1}>
							<InputLabel htmlFor='email-login'>Email Address</InputLabel>
							<OutlinedInput
								id='email-login'
								type='email'
								// value={values.email}
								name='username'
								// onBlur={handleBlur}
								onChange={handleChange}
								placeholder='Enter email address'
								fullWidth

								// error={Boolean(touched.email && errors.email)}
							/>
							{/* {touched.email && errors.email && (
								<FormHelperText error id='standard-weight-helper-text-email-login'>
									{errors.email}
								</FormHelperText>
							)} */}
						</Stack>
					</Grid>
					<Grid item xs={12}>
						<Stack spacing={1}>
							<InputLabel htmlFor='password-login'>Password</InputLabel>
							<OutlinedInput
								fullWidth
								color={capsWarning ? 'warning' : 'primary'}
								// error={Boolean(touched.password && errors.password)}
								id='-password-login'
								type={showPassword ? 'text' : 'password'}
								// value={values.password}
								name='password'
								onBlur={(event) => {
									setCapsWarning(false);
									// handleBlur(event);
								}}
								onKeyDown={onKeyDown}
								onChange={handleChange}
								endAdornment={
									<InputAdornment position='end'>
										<IconButton aria-label='toggle password visibility' onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge='end' color='secondary'>
											{showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
										</IconButton>
									</InputAdornment>
								}
								placeholder='Enter password'
							/>
							{capsWarning && (
								<Typography variant='caption' sx={{ color: 'warning.main' }} id='warning-helper-text-password-login'>
									Caps lock on!
								</Typography>
							)}
							{/* {touched.password && errors.password && (
								<FormHelperText error id='standard-weight-helper-text-password-login'>
									{errors.password}
								</FormHelperText>
							)} */}
						</Stack>
					</Grid>
					<Grid item xs={12}>
						{emptyFieldsError && (
							<FormHelperText error id='empty-fields-error'>
								Please check your Credentials
							</FormHelperText>
						)}
						{wrongCredentialsError && (
							<FormHelperText error id='wrong-credentials-error'>
								Incorrect username or password
							</FormHelperText>
						)}
					</Grid>

					{/* <Grid item xs={12} sx={{ mt: -1 }}>
						<Stack direction='row' justifyContent='space-between' alignItems='center' spacing={2}>
							<FormControlLabel
								control={
									<Checkbox
										checked={checked}
										onChange={(event) => setChecked(event.target.checked)}
										name='checked'
										color='primary'
										size='small'
									/>
								}
								label={<Typography variant='h6'>Keep me sign in</Typography>}
							/>
							<Link
								variant='h6'
								component={RouterLink}
								// to={isLoggedIn ? '/auth/forgot-password' : '/forgot-password'}
								color='text.primary'
							>
								Forgot Password?
							</Link>
						</Stack>
					</Grid> */}
					{/* {errors.submit && (
						<Grid item xs={12}>
							<FormHelperText error>{errors.submit}</FormHelperText>
						</Grid>
					)} */}
					<Grid item xs={12}>
						<AnimateButton>
							<Button
								disableElevation
								// disabled={isSubmitting}
								fullWidth
								size='large'
								type='submit'
								variant='contained'
								color='primary'
							>
								Login
							</Button>
						</AnimateButton>
					</Grid>
					{/* <Grid item xs={12}>
						<Divider>
							<Typography variant='caption'> Login with</Typography>
						</Divider>
					</Grid>
					<Grid item xs={12}>
						<FirebaseSocial />
					</Grid> */}
				</Grid>
			</form>
		</>
	);
};

export default AuthLogin;
