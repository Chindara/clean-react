import React, { useId, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// MUI
import { Grid, TextField, InputLabel, Stack, Box, Skeleton, Autocomplete, CircularProgress } from '@mui/material';

// CONTEXTS
import { useCompany } from 'pages/adminCenter/company/contexts/CompanyContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
// import { COMPANY_ERROR } from 'constants/ValidationMessage';
// import { CONTROL_SIZE } from 'constants/Common';
import LookupService from 'services/LookupService';
import useAuth from 'hooks/useAuth';

// VALIDATIONS
import { isEmpty } from 'validations/validation';
import { COMPANY_ERROR } from 'constants/ValidationMessage';
import MainCard from 'components/MainCard';

// ==============================|| ASSIGN USER FORM ||============================== //

export default function AssignUserForm({ isFetching }) {
	const id = useId();
	const { assignUser, setAssignUser, error, setError, mode } = useCompany();

	const { companyId } = useAuth();
	const [selectedAssignees, setSelectedAssignees] = useState([]);
	//const [assignedUsers, setAssignedUsers] = useState([]);

	useEffect(() => {
		(async () => {
			try {
				const { data = [] } = await LookupService.getUsers(companyId);

				const companyAssignees = data.reduce((accumulator, object) => [...accumulator, { label: object.name, value: object.id }], []);

				setSelectedAssignees(companyAssignees);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	const handleAutoComplete = (value) => {
		let errorList = [...error];
		let valueIndex = errorList.indexOf('validate-assignees');

		setAssignUser((prevState) => ({ ...prevState, assignees: value }));
		if (valueIndex !== -1) errorList.splice(valueIndex, 1) && setError(errorList);
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
								<InputLabel required>Assign User</InputLabel>
								<Autocomplete
									multiple
									id='assignees'
									options={selectedAssignees}
									getOptionLabel={(option) => option.label}
									disabled={mode === OPERATION_MODE.View}
									filterSelectedOptions
									isOptionEqualToValue={(option, value) => option?.value === value?.value}
									value={assignUser.assignees}
									noOptionsText={'No Results'}
									clearOnBlur
									onChange={(event, value) => handleAutoComplete(value)}
									renderInput={(params) => (
										<TextField
											{...params}
											placeholder='Select Assignees'
											fullWidth
											InputProps={{
												...params.InputProps,
												endAdornment: (
													<>
														{isFetching && <CircularProgress color='primary' size={16} />}
														{params.InputProps.endAdornment}
													</>
												),
											}}
											error={error.includes('validate-assignees')}
											helperText={error.includes('validate-assignees') && COMPANY_ERROR.assignUserRequired}
										/>
									)}
								/>
							</Stack>
						</Grid>
					</Grid>
				</MainCard>
			)}
		</>
	);
}

AssignUserForm.propTypes = {
	isFetching: PropTypes.bool,
};
