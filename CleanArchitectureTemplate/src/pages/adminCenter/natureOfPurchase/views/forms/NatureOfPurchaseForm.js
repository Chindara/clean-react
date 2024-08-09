import React, { useId } from 'react';
import PropTypes from 'prop-types';

// MUI
import { Grid, TextField, InputLabel, Stack, Box, Skeleton, FormControl, MenuItem, Select } from '@mui/material';

// CONTEXTS
import { useNatureOfPurchase } from 'pages/adminCenter/natureOfPurchase/contexts/NatureOfPurchaseContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { NATURE_ERROR } from 'constants/ValidationMessage';
import { CONTROL_SIZE } from 'constants/Common';
import MainCard from 'components/MainCard';

// ==============================|| NatureOfPurchase FORM ||============================== //

export default function NatureOfPurchaseForm({ isFetching }) {
	const id = useId();
	const { natureOfPurchase, setNatureOfPurchase, error, setError, mode } = useNatureOfPurchase();

	const handleNatureOfPurchase = (event) => {
		const { name, value } = event.target;

		let errorList = error;
		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		setNatureOfPurchase({ ...natureOfPurchase, [name]: value });
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
								<InputLabel required>Name</InputLabel>
								<TextField
									id={`name-${id}`}
									name='name'
									size={CONTROL_SIZE}
									value={natureOfPurchase.name}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter Name'
									fullWidth
									error={error.includes('validate-name')}
									helperText={error.includes('validate-name') && NATURE_ERROR.nameRequired}
									onChange={handleNatureOfPurchase}
								/>
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
											name='status'
											value={natureOfPurchase.status}
											onChange={handleNatureOfPurchase}
											displayEmpty
											disabled={mode === OPERATION_MODE.View}
										>
											<MenuItem value={1}>Active</MenuItem>
											<MenuItem value={2}>Inactive</MenuItem>
										</Select>
									</FormControl>
								</Stack>
							</Grid>
						)}
					</Grid>
				</MainCard>
			)}
		</>
	);
}

NatureOfPurchaseForm.propTypes = {
	isFetching: PropTypes.bool,
};
