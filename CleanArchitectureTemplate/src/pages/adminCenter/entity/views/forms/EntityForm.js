import React, { useId } from 'react';
import PropTypes from 'prop-types';

// MUI
import { Grid, TextField, InputLabel, Stack, Box, Skeleton, FormControl, MenuItem, Select } from '@mui/material';

// CONTEXTS
import { useEntity } from 'pages/adminCenter/entity/contexts/EntityContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { ENTITY_ERROR } from 'constants/ValidationMessage';
import { CONTROL_SIZE } from 'constants/Common';
import MainCard from 'components/MainCard';

// ==============================|| Entity FORM ||============================== //

export default function EntityForm({ isFetching }) {
	const id = useId();
	const { entity, setEntity, error, setError, mode } = useEntity();

	const handleEntity = (event) => {
		const { name, value } = event.target;

		let errorList = error;
		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		setEntity({ ...entity, [name]: value });
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
									value={entity.name}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter Name'
									fullWidth
									error={error.includes('validate-name')}
									helperText={error.includes('validate-name') && ENTITY_ERROR.nameRequired}
									onChange={handleEntity}
								/>
							</Stack>
						</Grid>
						{mode !== OPERATION_MODE.Create && (
							<Grid item xs={12}>
								<Stack spacing={0.5}>
									<InputLabel required>Status</InputLabel>
									<FormControl fullWidth>
										<Select variant='outlined' size={CONTROL_SIZE} name='status' value={entity.status} onChange={handleEntity} displayEmpty disabled={mode === OPERATION_MODE.View}>
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

EntityForm.propTypes = {
	isFetching: PropTypes.bool,
};
