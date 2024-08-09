import React from 'react';
import PropTypes from 'prop-types';

// MUI
import { useTheme } from '@mui/material/styles';
import { Box, Button, Drawer, Grid, Typography, Divider, Stack, Tooltip } from '@mui/material';

// THIRD-PARTY
import SimpleBar from 'components/third-party/SimpleBar';

// PROJECT IMPORT
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import LoadingButton from 'components/@extended/LoadingButton';

// ASSETS
import { CloseOutlined } from '@ant-design/icons';

// ==============================|| PANEL ||============================== //
export default function Panel({ panel, panelHeader, panelContent, panelFooter }) {
	const theme = useTheme();
	const { openPanel = false, variant = 'temporary', anchor = 'right', expand = false, handlePanelSave, handlePanelCancel, handlePanelClose, otherPanelProps } = panel;

	const { title, titleCloseButton = true, titleSX = {} } = panelHeader;
	const { content = <></>, contentDivider = false } = panelContent;
	const { footer = false, buttonLoader = true, footerContent } = panelFooter;

	return (
		<>
			<Drawer
				sx={{
					ml: openPanel ? 3 : 0,
					flexShrink: 0,
					zIndex: 1200,
					overflowX: 'hidden',
					width: {
						xs: '90%',
						sm: '90%',
						md: expand ? '50%' : '25%',
						lg: expand ? '50%' : '30%',
						xl: expand ? '50%' : '35%',
					},
					'& .MuiDrawer-paper': {
						height: '100vh',
						width: {
							xs: '90%',
							sm: '90%',
							md: expand ? '50%' : '25%',
							lg: expand ? '50%' : '30%',
							xl: expand ? '50%' : '35%',
						},
						position: 'fixed',
						border: 'none',
						borderRadius: '0px',
						backgroundImage: 'none',
					},
				}}
				variant={variant}
				anchor={anchor}
				open={openPanel}
				{...otherPanelProps}
				transitionDuration={{ enter: 310, exit: 290 }}
				ModalProps={{ keepMounted: true }}
			>
				{openPanel && (
					<>
						<Box>
							<Grid container sx={{ height: '100vh' }}>
								{/* PANEL HEADER SECTION */}
								<>
									<Grid item xs={12} sx={{ height: '60px' }}>
										<Box p={1.5}>
											<Stack direction='row' alignItems='center' justifyContent='space-between'>
												{title && (
													<Typography variant='h4' sx={{ ...titleSX }}>
														{title}
													</Typography>
												)}
												{titleCloseButton && (
													<Tooltip title='Close'>
														<IconButton size='small' sx={{ fontSize: '0.875rem', color: theme.palette.grey[500] }} onClick={handlePanelClose}>
															<CloseOutlined />
														</IconButton>
													</Tooltip>
												)}
											</Stack>
										</Box>
									</Grid>
								</>
								{/* PANEL HEADER SECTION */}

								{contentDivider && (
									<Grid item xs={12}>
										<Divider />
									</Grid>
								)}

								{/* PANEL CONTENT SECTION */}
								<>
									<Grid item xs={12} sx={{ height: 'calc(100% - 117px)' }}>
										<Box sx={{ height: '100%' }}>
											<SimpleBar
												sx={{
													height: '100%',
													'& .simplebar-content': {
														height: '100%',
														display: 'inherit',
														flexDirection: 'inherit',
													},
												}}
											>
												<>{content}</>
											</SimpleBar>
										</Box>
									</Grid>
								</>
								{/* PANEL CONTENT SECTION */}

								{contentDivider && (
									<Grid item xs={12}>
										<Divider />
									</Grid>
								)}

								{/* PANEL FOOTER SECTION */}
								<>
									<Grid item xs={12} sx={{ height: '55px' }}>
										{footer && (
											<Box>
												<>
													{footerContent && footerContent}

													{!footerContent && (
														<Box px={1} py={1.5}>
															<Stack direction='row' justifyContent='space-between'>
																<AnimateButton>
																	<LoadingButton
																		variant='contained'
																		color='primary'
																		fullWidth
																		loading={buttonLoader}
																		sx={{ height: '31px', fontSize: '0.8125rem' }}
																		onClick={handlePanelSave}
																	>
																		{buttonLoader ? '' : 'Save'}
																	</LoadingButton>
																</AnimateButton>

																<AnimateButton>
																	<Button size='small' color='secondary' variant='contained' fullWidth disabled={buttonLoader} onClick={handlePanelCancel}>
																		Cancel
																	</Button>
																</AnimateButton>
															</Stack>
														</Box>
													)}
												</>
											</Box>
										)}
									</Grid>
								</>
								{/* PANEL FOOTER SECTION */}
							</Grid>
						</Box>
					</>
				)}
			</Drawer>
		</>
	);
}

Panel.defaultProps = {
	panel: {},
	panelHeader: {},
	panelContent: {},
	panelFooter: {},
};

Panel.propTypes = {
	panel: PropTypes.object.isRequired,
	panelHeader: PropTypes.object,
	panelContent: PropTypes.object.isRequired,
	panelFooter: PropTypes.object,
};
