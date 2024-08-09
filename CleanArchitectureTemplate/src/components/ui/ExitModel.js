import React from 'react';
import PropTypes from 'prop-types';

// MUI
import { useTheme } from '@mui/material/styles';
import { Button, Dialog, DialogContent, IconButton, InputLabel, Stack, Typography } from '@mui/material';

// PROJECT IMPORT
import AnimateButton from 'components/@extended/AnimateButton';

// ASSETS
import { CloseOutlined } from '@ant-design/icons';

// ==============================|| EXIT MODAL ||============================== //
export default function ExitModel({ openModal, handleModalClose }) {
	const theme = useTheme();

	return (
		<>
			<Dialog
				open={openModal}
				keepMounted
				maxWidth='xs'
				aria-labelledby='exit-modal'
				aria-describedby='docubinet exit-modal'
				sx={{
					'& .MuiDialog-paper': {
						backgroundImage: 'none',
					},
				}}
			>
				{openModal && (
					<>
						<DialogContent sx={{ mt: 1, my: 1 }}>
							<Stack mb={1.5} direction='row' spacing={8}>
								<Stack spacing={10}>
									<Typography variant='h5' align='left'>
										Are you sure you want to close?
									</Typography>
								</Stack>
								<Stack>
									<IconButton
										color='secondary'
										onClick={handleModalClose}
										size='small'
										sx={{
											fontSize: '0.875rem',
											position: 'absolute',
											right: 15,
											top: 26,
											borderRadius: 1,
										}}
									>
										<CloseOutlined />
									</IconButton>
								</Stack>
							</Stack>
							<Stack alignItems='flex-start' spacing={3.5}>
								<Stack spacing={2}>
									<Typography variant='subtitle2' align='left'>
										All the info you&apos;ve entered will be lost.
									</Typography>
								</Stack>

								<Stack direction='row' spacing={2} sx={{ width: 1 }}>
									<AnimateButton>
										<Button
											color='primary'
											variant='contained'
											size='small'
											onClick={() => handleModalClose('Yes')}
										>
											<InputLabel sx={{ color: 'white', fontWeight: '600' }}>Yes</InputLabel>
										</Button>
									</AnimateButton>

									<AnimateButton>
										<Button
											color='secondary'
											variant='contained'
											size='small'
											onClick={() => handleModalClose()}
										>
											<InputLabel
												sx={{ color: theme.palette.mode === 'dark' ? 'black' : 'white', fontWeight: '600' }}
											>
												No
											</InputLabel>
										</Button>
									</AnimateButton>
								</Stack>
							</Stack>
						</DialogContent>
					</>
				)}
			</Dialog>
		</>
	);
}

ExitModel.defaultProps = {
	openModal: false,
};

ExitModel.propTypes = {
	openModal: PropTypes.bool,
	handleModalClose: PropTypes.func.isRequired,
};
