import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// MUI
import { Link, Stack, Typography } from '@mui/material';

const Footer = () => (
	<Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ p: '24px 16px 0px', mt: 'auto' }}>
		<Typography variant='caption'>
			&copy;{' '}
			<Link href='https://www.dmsswe.com/' target='_blank' variant='caption' color='textPrimary'>
				DMS Software Engineering (Pvt) Ltd
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
		<Stack spacing={1.5} direction='row' justifyContent='space-between' alignItems='center'>
			<Link component={RouterLink} href='#' target='_self' variant='caption' color='textPrimary'>
				About us
			</Link>
			<Link component={RouterLink} href='#' target='_self' variant='caption' color='textPrimary'>
				Privacy
			</Link>
			<Link component={RouterLink} href='#' target='_blank' variant='caption' color='textPrimary'>
				Terms
			</Link>
		</Stack>
	</Stack>
);

export default React.memo(Footer);
