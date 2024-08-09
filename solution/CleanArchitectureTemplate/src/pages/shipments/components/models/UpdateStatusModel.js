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
import { SHIPMENT_STATUS } from 'constants/Common';
import { useShipment } from 'pages/shipments/contexts/ShipmentsContext';

// ==============================|| UPDATE STATUS MODAL ||============================== //

export default function UpdateStatusModel({ openStatusModal, handleStatusModalClose, statusloading, handleStatusChange }) {
	const {
		shipment: { status },
	} = useShipment();
	return (
		<Dialog
			open={openStatusModal}
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
			{openStatusModal && (
				<React.Fragment>
					<IconButton
						aria-label='close'
						onClick={handleStatusModalClose}
						sx={{
							position: 'absolute',
							right: 0,
							top: 0,
						}}
					>
						<CloseIcon />
					</IconButton>
					<DialogContent sx={{ mt: 2, my: 1 }}>
						<Stack direction='column' spacing={2} alignItems='center' justifyContent='center'>
							<Button
								size='large'
								onClick={() => handleStatusChange(SHIPMENT_STATUS.UnderClearance)}
								color='warning'
								variant='contained'
								disabled={statusloading || status === SHIPMENT_STATUS.UnderClearance || status === SHIPMENT_STATUS.Cleared}
								autoFocus
								sx={{ width: '80%' }}
							>
								Under Clearance
							</Button>
							{statusloading && (
								<LoadingButton
									fullWidth
									size='small'
									loading={statusloading}
									color='success'
									disabled={statusloading}
									variant='text'
									autoFocus
									sx={{ width: '80%', height: '30px', fontSize: '0.8125rem', color: 'white', mt: 1 }}
								>
									{''}
								</LoadingButton>
							)}
						</Stack>
					</DialogContent>
				</React.Fragment>
			)}
		</Dialog>
	);
}

UpdateStatusModel.defaultProps = {
	openStatusModal: false,
	Statusloading: false,
};

UpdateStatusModel.propTypes = {
	openStatusModal: PropTypes.bool,
	handleStatusModalClose: PropTypes.func.isRequired,
	statusloading: PropTypes.bool,
	handleStatusChange: PropTypes.func.isRequired,
};
