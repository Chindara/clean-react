import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { Box, Grid } from '@mui/material';

// project import
import AuthFooter from 'components/cards/AuthFooter';
import Logo from 'components/logo';
import AuthCard from './login/AuthCard';

// assets
import AuthBackground from 'assets/images/auth/AuthBackground';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

const AuthWrapper = ({ children }) => (
	<Box sx={{ minHeight: '100vh' }}>
		<AuthBackground />
		<Grid
			container
			direction='column'
			justifyContent='center'
			sx={{
				minHeight: '100vh',
			}}
		>
			<Grid xs={12} container item justifyContent='center' alignItems='center'>
				<Logo />
			</Grid>
			<Grid item xs={12}>
				<Grid xs={12} container item justifyContent='center' alignItems='center'>
					<Grid item>
						<AuthCard>{children}</AuthCard>
					</Grid>
				</Grid>
			</Grid>
			{/* <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
				<AuthFooter />
			</Grid> */}
		</Grid>
	</Box>
);

AuthWrapper.propTypes = {
	children: PropTypes.node,
};

export default AuthWrapper;
