import React from 'react';
import PropTypes from 'prop-types';

// MUI
import { Box, Button, Stack } from '@mui/material';

// PROJECT IMPORT
import AnimateButton from 'components/@extended/AnimateButton';
import LoadingButton from 'components/@extended/LoadingButton';

// CONSTANTS
import { OPERATION_MODE } from '../../../../../constants/Types';

// ==============================|| PANEL FOOTER ||============================== //

export default function PanelFooter({ footerMode, buttonLoader, handleSubmit, handlePanelClose, handlePanelCancel }) {
	return (
		<>
			<Box px={1} py={1.5}>
				<Stack direction='row' justifyContent='start' spacing={1}>
					{(footerMode === OPERATION_MODE.Create || footerMode === OPERATION_MODE.Edit || footerMode === OPERATION_MODE.AssignUser) && (
						<AnimateButton>
							<LoadingButton
								fullWidth
								loading={buttonLoader}
								color='primary'
								variant='contained'
								onClick={handleSubmit}
								sx={{
									height: '30px',
									fontSize: '0.8125rem',
									color: 'white',
								}}
							>
								{buttonLoader ? '' : 'Save'}
							</LoadingButton>
						</AnimateButton>
					)}

					<AnimateButton>
						<Button
							variant='outlined'
							size='small'
							color='secondary'
							disabled={buttonLoader}
							onClick={footerMode === OPERATION_MODE.Create || footerMode === OPERATION_MODE.Edit ? handlePanelCancel : handlePanelClose}
						>
							{footerMode === OPERATION_MODE.Create || footerMode === OPERATION_MODE.Edit ? 'Cancel' : 'Close'}
						</Button>
					</AnimateButton>
				</Stack>
			</Box>
		</>
	);
}

PanelFooter.defaultProps = {
	footerMode: OPERATION_MODE.Create,
};

PanelFooter.propTypes = {
	footerMode: PropTypes.number,
	buttonLoader: PropTypes.bool.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	handlePanelClose: PropTypes.func.isRequired,
	handlePanelCancel: PropTypes.func.isRequired,
};
