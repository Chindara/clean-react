import React from 'react';

import MainCard from 'components/MainCard';
import { useTheme } from '@mui/material/styles';
import { Grid, Divider, TextField, InputLabel, Stack, Button, Typography, MenuItem, FormControl, Select, FormHelperText } from '@mui/material';
import PropTypes from 'prop-types';

import { CONTROL_SIZE } from 'constants/Common';
import useAuth from 'hooks/useAuth';
import { usePurchaseOrderHistory } from 'pages/purchaseOrder/contexts/HistoryContext';
import { VALIDATION_ERROR } from 'constants/ValidationMessage';
import { useQuery } from '@tanstack/react-query';

import Timeline from '@mui/lab/Timeline';
import PurchaseOrderHistoryItem from '../../components/PurchaseOrderHistoryItem';

export default function PurchaseOrderHistoryForm({ handleSubmit }) {
	const theme = useTheme();
	const { userId, companyId } = useAuth();
	const { purchaseOrderHistory, setPurchaseOrderHistory, purchaseOrderHistories, setPurchaseOrderHistories, error, setError } = usePurchaseOrderHistory();

	const onChange = (event) => {
		const { name, value } = event.target;

		let errorList = error;
		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		setPurchaseOrderHistory({ ...purchaseOrderHistory, [name]: value });
	};

	return (
		<>
			<MainCard border={false}>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<Stack spacing={1}>
							<InputLabel required>Comment</InputLabel>
							<TextField
								name='comment'
								value={purchaseOrderHistory.comment}
								placeholder='Enter Comment'
								fullWidth
								multiline
								rows={6}
								size={CONTROL_SIZE}
								onChange={onChange}
								error={error.includes('validate-comment')}
								helperText={error.includes('validate-comment') && VALIDATION_ERROR.commentRequired}
							/>
						</Stack>
						<Stack spacing={1}>
							<Divider sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#484848' : '#e1e1e1', mt: 0.5 }} />
							<Stack direction='row' justifyContent='end' style={{ marginTop: 8, marginBottom: 16 }}>
								<Button variant='contained' color='primary' onClick={handleSubmit}>
									Save
								</Button>
							</Stack>
						</Stack>
					</Grid>
					<Grid item xs={12} md={6}>
						<Timeline
							sx={{
								'& .MuiTimelineItem-root': { minHeight: 90 },
								'& .MuiTimelineOppositeContent-root': { mt: 0.5, width: 2, flex: '0 0 20%' },
								'& .MuiTimelineDot-root': {
									borderRadius: 1.25,
									boxShadow: 'none',
									margin: 0,
									ml: 1.25,
									mr: 1.25,
									p: 1,
									'& .MuiSvgIcon-root': { fontSize: '1.2rem' },
								},
								'& .MuiTimelineContent-root': { borderRadius: 1, bgcolor: 'secondary.lighter', height: '100%', mb: 1 },
								'& .MuiTimelineConnector-root': { border: '1px dashed', borderColor: 'secondary.light', bgcolor: 'transparent' },
							}}
						>
							{purchaseOrderHistories?.length > 0 &&
								purchaseOrderHistories.map(({ id, comment, createdBy, created }) => (
									<PurchaseOrderHistoryItem key={id} comment={comment} user={createdBy} timeStamp={created}></PurchaseOrderHistoryItem>
								))}
						</Timeline>
					</Grid>
				</Grid>
			</MainCard>
		</>
	);
}

PurchaseOrderHistoryForm.propTypes = {
	handleSubmit: PropTypes.func,
};
