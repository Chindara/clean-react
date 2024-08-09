import React from 'react';
import PropTypes from 'prop-types';

import { Typography } from '@mui/material';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import DirectionsBoatOutlinedIcon from '@mui/icons-material/DirectionsBoatOutlined';

export default function PurchaseOrderHistoryItem({ comment, user, timeStamp }) {
	return (
		<TimelineItem>
			<TimelineOppositeContent align='right' variant='body2' color='text.secondary'>
				{timeStamp}
			</TimelineOppositeContent>
			<TimelineSeparator>
				<TimelineDot sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
					<DirectionsBoatOutlinedIcon fontSize='small' />
				</TimelineDot>
				<TimelineConnector />
			</TimelineSeparator>
			<TimelineContent>
				<Typography variant='h6' component='span'>
					<p style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: comment }} />
				</Typography>
				<Typography color='textSecondary'>{user}</Typography>
			</TimelineContent>
		</TimelineItem>
	);
}

PurchaseOrderHistoryItem.propTypes = {
	comment: PropTypes.string,
	user: PropTypes.string,
	timeStamp: PropTypes.string,
};
