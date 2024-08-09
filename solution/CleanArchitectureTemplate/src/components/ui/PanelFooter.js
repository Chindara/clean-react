import React from 'react';
import PropTypes from 'prop-types';

// MUI
import { Box, Button, Stack } from '@mui/material';

// PROJECT IMPORT
import AnimateButton from 'components/@extended/AnimateButton';
import LoadingButton from 'components/@extended/LoadingButton';

// CONSTANTS
import { OPERATION_MODE } from './../../constants/Types';

// ==============================|| PANEL FOOTER ||============================== //

export default function PanelFooter({ footerMode, buttonLoader, handleSubmit, handlePanelClose, handlePanelCancel }) {
	return (
		<>
			<Box px={1} py={1.5}>
				<Stack direction='row' justifyContent='start' spacing={1}>
					{(footerMode === OPERATION_MODE.Create || footerMode === OPERATION_MODE.Edit) && (
						// <AnimateButton>
						<LoadingButton
							variant='contained'
							color='primary'
							size='small'
							loading={buttonLoader}
							onClick={handleSubmit}
							sx={{
								height: '31px',
							}}
						>
							{buttonLoader ? '' : 'Save'}
						</LoadingButton>
						// </AnimateButton>
					)}

					{/* <AnimateButton> */}
					<Button
						variant='outlined'
						color='secondary'
						size='small'
						disabled={buttonLoader}
						onClick={footerMode === OPERATION_MODE.Create || footerMode === OPERATION_MODE.Edit ? handlePanelCancel : handlePanelClose}
						sx={{
							height: '31px',
						}}
					>
						{footerMode === OPERATION_MODE.Create || footerMode === OPERATION_MODE.Edit ? 'Cancel' : 'Close'}
					</Button>
					{/* </AnimateButton> */}
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
