import React from 'react';
import PropTypes from 'prop-types';

// MUI
import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';

// PROJECT IMPORT
import Avatar from 'components/@extended/Avatar';
import LoadingButton from 'components/@extended/LoadingButton';

// ASSETS
import { KeyOutlined } from '@ant-design/icons';

// ==============================|| DELETE MODAL ||============================== //
export default function ResetConfirmModel({ openModal, handleModalClose, loading, handleReset }) {
	return (
		<Dialog
			open={openModal}
			keepMounted
			fullWidth
			maxWidth='xs'
			aria-labelledby='reset-modal'
			aria-describedby='lms reset-modal'
			sx={{
				'& .MuiDialog-paper': {
					backgroundImage: 'none',
				},
			}}
		>
			{openModal && (
				<DialogContent sx={{ mt: 2, my: 1 }}>
					<Stack alignItems='center' spacing={3.5}>
						<Avatar color='error' sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
							<KeyOutlined />
						</Avatar>
						<Stack spacing={2}>
							<Typography variant='h5' align='center'>
								Are you sure you want to reset password of this user?
							</Typography>
						</Stack>

						<Stack direction='row' spacing={2} sx={{ width: 1 }}>
							<Button fullWidth size='small' onClick={handleModalClose} color='secondary' variant='outlined'>
								Cancel
							</Button>
							<LoadingButton
								fullWidth
								loading={loading}
								color='error'
								variant='contained'
								onClick={handleReset}
								autoFocus
								sx={{ height: '30px', fontSize: '0.8125rem', color: 'white' }}
							>
								{loading ? '' : 'Reset Password'}
							</LoadingButton>
						</Stack>
					</Stack>
				</DialogContent>
			)}
		</Dialog>
	);
}

ResetConfirmModel.defaultProps = {
	openModal: false,
	loading: false,
};

ResetConfirmModel.propTypes = {
	openModal: PropTypes.bool,
	handleModalClose: PropTypes.func.isRequired,
	loading: PropTypes.bool,
	handleReset: PropTypes.func.isRequired,
};
