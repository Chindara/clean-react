import React, { useId, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// MUI
import { Grid, Switch, TextField, InputLabel, Stack, Box, Skeleton, FormControl, MenuItem, Select, FormGroup, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';

// CONTEXTS
import { useCompany } from 'pages/adminCenter/company/contexts/CompanyContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { COMPANY_ERROR } from 'constants/ValidationMessage';
import { CONTROL_SIZE } from 'constants/Common';
import LookupService from 'services/LookupService';
import useAuth from 'hooks/useAuth';

// ==============================|| COMPANY FORM ||============================== //

const IOSSwitch = styled((props) => <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />)(({ theme }) => ({
	width: 42,
	height: 26,
	padding: 0,
	'& .MuiSwitch-switchBase': {
		padding: 0,
		margin: 2,
		transitionDuration: '300ms',
		'&.Mui-checked': {
			transform: 'translateX(16px)',
			color: '#fff',
			'& + .MuiSwitch-track': {
				backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
				opacity: 1,
				border: 0,
			},
			'&.Mui-disabled + .MuiSwitch-track': {
				opacity: 0.5,
			},
		},
		'&.Mui-focusVisible .MuiSwitch-thumb': {
			color: '#33cf4d',
			border: '6px solid #fff',
		},
		'&.Mui-disabled .MuiSwitch-thumb': {
			color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
		},
		'&.Mui-disabled + .MuiSwitch-track': {
			opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
		},
	},
	'& .MuiSwitch-thumb': {
		boxSizing: 'border-box',
		width: 22,
		height: 22,
	},
	'& .MuiSwitch-track': {
		borderRadius: 26 / 2,
		backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
		opacity: 1,
		transition: theme.transitions.create(['background-color'], {
			duration: 500,
		}),
	},
}));

export default function CompanyForm({ isFetching }) {
	const id = useId();
	const { company, setCompany, error, setError, mode } = useCompany();

	const handleCompany = (event) => {
		const { name, value } = event.target;

		let errorList = error;
		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		setCompany({ ...company, [name]: value });
	};

	const onCheck = (event) => {
		const { name, checked } = event.target;
		let errorList = error;
	
		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}
	
		setCompany({ ...company, [name]: checked });
	};
	

	return (
		<>
			{isFetching ? (
				<Box px={1} mt={1}>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<Skeleton animation='wave' variant='rounded' width='100%' height={30} />
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<Skeleton animation='wave' variant='rounded' width='100%' height={30} />
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<Skeleton animation='wave' variant='rounded' width='100%' height={30} />
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<Skeleton animation='wave' variant='rounded' width='100%' height={30} />
							</Stack>
						</Grid>
					</Grid>
				</Box>
			) : (
				<Grid container spacing={2} justifyContent={'center'} padding={2}>
					<Grid container item xs={12} spacing={2}>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<InputLabel required>Name</InputLabel>
								<TextField
									id={`name-${id}`}
									name='name'
									size={CONTROL_SIZE}
									value={company.name}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter Name'
									fullWidth
									error={error.includes('validate-name')}
									helperText={error.includes('validate-name') && COMPANY_ERROR.nameRequired}
									onChange={handleCompany}
								/>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<InputLabel required>Address</InputLabel>
								<TextField
									id={`address-${id}`}
									name='address'
									size={CONTROL_SIZE}
									value={company.address}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter Address'
									fullWidth
									error={error.includes('validate-address')}
									helperText={error.includes('validate-address') && COMPANY_ERROR.addressRequired}
									onChange={handleCompany}
								/>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<InputLabel required>VAT No</InputLabel>
								<TextField
									id={`vatNo-${id}`}
									name='vatNo'
									size={CONTROL_SIZE}
									value={company.vatNo}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter VAT No'
									fullWidth
									error={error.includes('validate-vatNo')}
									helperText={error.includes('validate-vatNo') && COMPANY_ERROR.vatNoRequired}
									onChange={handleCompany}
								/>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<InputLabel required>BR No</InputLabel>
								<TextField
									id={`brNo-${id}`}
									name='brNo'
									size={CONTROL_SIZE}
									value={company.brNo}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter BR No'
									fullWidth
									error={error.includes('validate-brNo')}
									helperText={error.includes('validate-brNo') && COMPANY_ERROR.brNoRequired}
									onChange={handleCompany}
								/>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<InputLabel required>Purchase Based</InputLabel>
								<FormGroup>
									<FormControlLabel
										size={CONTROL_SIZE}
										name='isPurchaseBased'
										onChange={onCheck}
										checked={company.isPurchaseBased}
										control={<IOSSwitch />}
										disabled={mode === OPERATION_MODE.View}
									/>
								</FormGroup>
							</Stack>
						</Grid>

						{mode !== OPERATION_MODE.Create && (
							<Grid item xs={12}>
								<Stack spacing={0.5}>
									<InputLabel required>Status</InputLabel>
									<FormControl fullWidth>
										<Select
											variant='outlined'
											size={CONTROL_SIZE}
											//options={statusChoices}
											name='status'
											value={company.status}
											onChange={handleCompany}
											//error={error.includes('validate-natureOfPurchase')}
											displayEmpty
											disabled={mode === OPERATION_MODE.View}
											//renderInput={(params) => <TextField {...params} placeholder='Select Status' />}
										>
											<MenuItem value={1}>Active</MenuItem>
											<MenuItem value={2}>Inactive</MenuItem>
										</Select>
										{/* {error.includes('validate-natureOfPurchase') && (
												<FormHelperText error>{VALIDATION_ERROR.natureOfPurchaseRequired}</FormHelperText>
											)} */}
									</FormControl>
								</Stack>
							</Grid>
						)}
					</Grid>
				</Grid>
			)}
		</>
	);
}

CompanyForm.propTypes = {
	isFetching: PropTypes.bool,
};
