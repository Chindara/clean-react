import React from 'react';
import PropTypes from 'prop-types';

// MUI
import { Button, Divider, Grid, Stack } from '@mui/material';

import { useTheme } from '@mui/material/styles';
import AnimateButton from 'components/@extended/AnimateButton';
import LoadingButton from 'components/@extended/LoadingButton';

export default function PurchaseOrderBankButtonAction({ loader, handleSubmit }) {
	const theme = useTheme();

	return (
		<>
			<Grid container item spacing={1} sx={{ mt: 1 }}>
				<Grid item xs={12} sm={12}>
					<Stack spacing={2}>
						<Divider sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#484848' : '#e1e1e1', mt: 0.5 }} />
						<Stack direction='row' justifyContent='end' sx={{ mt: 8, mb: 16 }}>
							<AnimateButton>
								<LoadingButton loading={loader} color='primary' variant='contained' onClick={handleSubmit} sx={{ height: '32px', fontSize: '0.8125rem' }}>
									{loader ? '' : 'Save'}
								</LoadingButton>
							</AnimateButton>
						</Stack>
					</Stack>
				</Grid>
			</Grid>
		</>
	);
}

PurchaseOrderBankButtonAction.propTypes = {
	loader: PropTypes.bool.isRequired,
	handleSubmit: PropTypes.func.isRequired,
};
