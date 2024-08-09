import PropTypes from 'prop-types';

// MUI
import { Box, Button, Stack, Grid } from '@mui/material';

// PROJECT IMPORT
import AnimateButton from 'components/@extended/AnimateButton';
import LoadingButton from 'components/@extended/LoadingButton';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';

// ==============================|| FORM FOOTER ||============================== //

export default function FormFooter({
	footerMode,
	buttonLoader,
	handleSubmit,
	handlePanelClose,
	handlePanelCancel,
}) {
	return (
		<>
			<Grid container spacing={3} justifyContent={'center'}>
				<Grid container item xs={11.2} spacing={1}>
					<Grid item xs={6} mt={3}>
						<Box px={1} py={1.5}>
							<Stack direction='row' justifyContent='start' spacing={1}>
								{(footerMode === OPERATION_MODE.Create || footerMode === OPERATION_MODE.Edit) && (
									<AnimateButton>
										<LoadingButton
											fullWidth
											loading={buttonLoader}
											color='primary'
											variant='contained'
											onClick={handleSubmit}
											sx={{ height: '30px', fontSize: '0.8125rem' }}
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
										onClick={
											footerMode === OPERATION_MODE.Create || footerMode === OPERATION_MODE.Edit
												? handlePanelCancel
												: handlePanelClose
										}
									>
										{footerMode === OPERATION_MODE.Create || footerMode === OPERATION_MODE.Edit
											? 'Cancel'
											: 'Close'}
									</Button>
								</AnimateButton>
							</Stack>
						</Box>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
}

FormFooter.defaultProps = {
	footerMode: OPERATION_MODE.Create,
};

FormFooter.propTypes = {
	footerMode: PropTypes.number,
	buttonLoader: PropTypes.bool.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	handlePanelClose: PropTypes.func.isRequired,
	handlePanelCancel: PropTypes.func.isRequired,
};
