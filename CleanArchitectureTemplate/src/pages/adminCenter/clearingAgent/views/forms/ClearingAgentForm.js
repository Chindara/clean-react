import React, { useId } from 'react';
import PropTypes from 'prop-types';

// MUI
import { Grid, TextField, InputLabel, Stack, Box, Skeleton, FormControl, MenuItem, Select } from '@mui/material';

// CONTEXTS
import { useClearingAgent } from 'pages/adminCenter/clearingAgent/contexts/ClearingAgentContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { CLEARING_AGENT_ERROR } from 'constants/ValidationMessage';
import { CONTROL_SIZE } from 'constants/Common';
import MainCard from 'components/MainCard';

// ==============================|| BANK FORM ||============================== //

export default function ClearingAgentForm({ isFetching }) {
	const id = useId();
	const { clearingAgent, setClearingAgent, error, setError, mode } = useClearingAgent();

	const handleClearingAgent = (event) => {
		const { name, value } = event.target;

		let errorList = error;
		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		setClearingAgent({ ...clearingAgent, [name]: value });
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
				<MainCard>
					<Grid container spacing={1} justifyContent='flex-start'>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<Stack spacing={1} direction='row'>
									<InputLabel required>Name</InputLabel>
								</Stack>
								<TextField
									id={`name-${id}`}
									name='name'
									size={CONTROL_SIZE}
									value={clearingAgent.name}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter Name'
									fullWidth
									error={error.includes('validate-name')}
									helperText={error.includes('validate-name') && CLEARING_AGENT_ERROR.nameRequired}
									onChange={handleClearingAgent}
								/>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
							{mode !== OPERATION_MODE.Create && (
								<Grid item xs={12}>
									<Stack spacing={1} direction='row'>
										<InputLabel required>Status</InputLabel>
									</Stack>
									<FormControl fullWidth>
										<Select
											variant='outlined'
											size={CONTROL_SIZE}
											//options={statusChoices}
											name='status'
											value={clearingAgent.status}
											onChange={handleClearingAgent}
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
								</Grid>
							)}
							</Stack>
						</Grid>	
					</Grid>
				</MainCard>
			)}
		</>
	);
}

ClearingAgentForm.propTypes = {
	isFetching: PropTypes.bool,
};
