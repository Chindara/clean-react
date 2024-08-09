import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// MUI
import { Box, Button, FormControl, FormHelperText, Grid, InputAdornment, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';

// project import
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { AUTH_ERROR } from 'constants/ValidationMessage';
import { validateChangePasswordForm } from '../validations/change-password-validation';
import AuthService from 'services/AuthService';
import { setAlertError, setAlertSuccess } from 'components/alert/Alert';
import { AUTH_ALERT } from 'constants/AlertMessage';
import useAuth from 'hooks/useAuth';

// ============================|| STATIC - RESET PASSWORD ||============================ //

const ChangePasswordForm = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { resetAuth } = useAuth();

	const [level, setLevel] = useState();
	const [show, setShow] = useState({ newPassword: false, confirmPassword: false });
	const [user, setUser] = useState({ newPassword: '', confirmPassword: '' });
	const [error, setError] = useState([]);

	const handleCheckPassword = (value) => {
		const temp = strengthIndicator(value);
		setLevel(strengthColor(temp));
	};

	const validationHandler = (name, ...optional) => {
		let errorList = error;

		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		if (optional.length) {
			for (const element of optional) {
				let errorIndex = errorList.indexOf(element);
				if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			}
			setError(errorList);
		}
	};

	const handleOnChange = (event) => {
		const { name, value } = event.target;

		validationHandler(name, 'validate-newPassword-level', 'validate-confirmPassword-match');
		setUser((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleChangePassword = async () => {
		if (!validateChangePasswordForm(user, level, setError)) return;
		const { state: { companyId = '', username = '', password = '' } = {} } = location || {};

		const { isSuccess } = await AuthService.changePassword({ username, password, newPassword: user.newPassword, companyId });

		if (isSuccess) {
			setAlertSuccess(AUTH_ALERT.Success.PasswordChanged);
			resetAuth();
		}

		if (!isSuccess) {
			setAlertError(AUTH_ALERT.Error.PasswordChanged);
		}
	};

	return (
		<>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Stack spacing={1}>
						<InputLabel htmlFor='new-password'>New Password</InputLabel>
						<OutlinedInput
							id='new-password'
							name='newPassword'
							fullWidth
							type={show.newPassword ? 'text' : 'password'}
							value={user.newPassword}
							error={error.includes('validate-newPassword') || error.includes('validate-newPassword-level')}
							onChange={(event) => {
								handleOnChange(event);
								handleCheckPassword(event.target.value);
							}}
							endAdornment={
								<InputAdornment position='end'>
									<IconButton
										aria-label='toggle new password visibility'
										onClick={() => setShow((prevState) => ({ ...prevState, newPassword: !prevState.newPassword }))}
										onMouseDown={(event) => event.preventDefault()}
										edge='end'
										color='secondary'
									>
										{show.newPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
									</IconButton>
								</InputAdornment>
							}
							placeholder='Enter new password'
						/>

						{error.includes('validate-newPassword') && (
							<FormHelperText error id='validate-new-password-input'>
								{AUTH_ERROR.ChangePassword.newPasswordRequired}
							</FormHelperText>
						)}
					</Stack>
					{user.newPassword?.length > 0 && (
						<FormControl fullWidth sx={{ mt: 2 }}>
							<Grid container spacing={2} alignItems='center'>
								<Grid item>
									<Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
								</Grid>
								<Grid item>
									<Typography variant='subtitle1' fontSize='0.75rem'>
										{level?.label}
									</Typography>
								</Grid>
							</Grid>
						</FormControl>
					)}
				</Grid>

				<Grid item xs={12}>
					<Stack spacing={1}>
						<InputLabel htmlFor='confirm-password'>Confirm Password</InputLabel>
						<OutlinedInput
							id='confirm-password'
							name='confirmPassword'
							fullWidth
							type={show.confirmPassword ? 'text' : 'password'}
							value={user.confirmPassword}
							error={error.includes('validate-confirmPassword') || error.includes('validate-confirmPassword-match')}
							onChange={handleOnChange}
							endAdornment={
								<InputAdornment position='end'>
									<IconButton
										aria-label='toggle confirm password visibility'
										onClick={() => setShow((prevState) => ({ ...prevState, confirmPassword: !prevState.confirmPassword }))}
										onMouseDown={(event) => event.preventDefault()}
										edge='end'
										color='secondary'
									>
										{show.confirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
									</IconButton>
								</InputAdornment>
							}
							placeholder='Enter confirm password'
						/>
						{error.includes('validate-confirmPassword') && (
							<FormHelperText error id='validate-confirm-password-input'>
								{AUTH_ERROR.ChangePassword.confirmPasswordRequired}
							</FormHelperText>
						)}

						{error.includes('validate-confirmPassword-match') && (
							<FormHelperText error id='validate-confirm-password-input-match'>
								{AUTH_ERROR.ChangePassword.confirmPasswordMatchError}
							</FormHelperText>
						)}
					</Stack>
				</Grid>

				<Grid item xs={12}>
					<AnimateButton>
						<Button disableElevation disabled={false} fullWidth size='large' variant='contained' color='primary' onClick={handleChangePassword}>
							Change Password
						</Button>
					</AnimateButton>
				</Grid>
			</Grid>
		</>
	);
};

export default ChangePasswordForm;
