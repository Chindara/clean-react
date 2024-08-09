import React, { useId } from 'react';
import PropTypes from 'prop-types';

// MUI
import { Grid, TextField, InputLabel, Stack, Box, Skeleton, FormControl, MenuItem, Select } from '@mui/material';

// CONTEXTS
import { usePort} from 'pages/adminCenter/port/contexts/PortContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { PORT_ERROR } from 'constants/ValidationMessage';
import { CONTROL_SIZE } from 'constants/Common';

// ==============================|| PORT FORM ||============================== //

export default function PortForm({ isFetching }) {
	const id = useId();
	const { port, setPort: setPort, error, setError, mode } = usePort();

	const handlePort= (event) => {
		const { name, value } = event.target;

		let errorList = error;
		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		setPort({ ...port, [name]: value });
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
									value={port.name}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter Name'
									fullWidth
									error={error.includes('validate-name')}
									helperText={error.includes('validate-name') && PORT_ERROR.nameRequired}
									onChange={handlePort}
								/>
							</Stack>
						</Grid>
						{mode !== OPERATION_MODE.Create && (
							<Grid item xs={12}>
								<Stack spacing={0.5}>
									<InputLabel required>Status</InputLabel>
									<FormControl fullWidth>
										<Select variant='outlined' size={CONTROL_SIZE} name='status' value={port.status} onChange={handlePort} displayEmpty disabled={mode === OPERATION_MODE.View}>
											<MenuItem value={1}>Active</MenuItem>
											<MenuItem value={2}>Inactive</MenuItem>
										</Select>
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

PortForm.propTypes = {
	isFetching: PropTypes.bool,
};
