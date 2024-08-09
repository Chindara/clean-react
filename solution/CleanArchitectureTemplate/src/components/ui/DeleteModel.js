import React from 'react';
import PropTypes from 'prop-types';

// MUI
import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// PROJECT IMPORT
import Avatar from 'components/@extended/Avatar';
import LoadingButton from 'components/@extended/LoadingButton';

// ASSETS
import { DeleteFilled } from '@ant-design/icons';

// ==============================|| DELETE MODAL ||============================== //
export default function DeleteModel({ openModal, handleModalClose, loading, handleDelete }) {
	return (
		<Dialog
			open={openModal}
			keepMounted
			fullWidth
			maxWidth='xs'
			aria-labelledby='delete-modal'
			aria-describedby='docubinet delete-modal'
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
							<DeleteFilled />
						</Avatar>
						<Stack spacing={2}>
							<Typography variant='h5' align='center'>
								Are you sure you want to delete?
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
								onClick={handleDelete}
								autoFocus
								sx={{ height: '30px', fontSize: '0.8125rem', color: 'white' }}
							>
								{loading ? '' : 'Delete'}
							</LoadingButton>
						</Stack>
					</Stack>
				</DialogContent>
			)}
		</Dialog>
	);
}

DeleteModel.defaultProps = {
	openModal: false,
	loading: false,
};

DeleteModel.propTypes = {
	openModal: PropTypes.bool,
	handleModalClose: PropTypes.func.isRequired,
	loading: PropTypes.bool,
	handleDelete: PropTypes.func.isRequired,
};
