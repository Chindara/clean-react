//MUI
import { Grid, Stack, Typography } from '@mui/material';

// PROJECT IMPORT
import AuthWrapper from '../AuthWrapper';
import ChangePasswordForm from './ChangePasswordForm';

// ================================|| RESET PASSWORD ||================================ //

const ChangePassword = () => (
	<AuthWrapper>
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Stack sx={{ mb: { xs: -0.5, sm: 0.5 } }} spacing={1}>
					<Typography variant='h3'>Change Password</Typography>
					<Typography color='secondary'>Please enter your new password</Typography>
				</Stack>
			</Grid>
			<Grid item xs={12}>
				<ChangePasswordForm />
			</Grid>
		</Grid>
	</AuthWrapper>
);

export default ChangePassword;
