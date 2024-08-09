import PropTypes from 'prop-types';
import React, { useState } from 'react';

// material-ui
import { Box, CardActions, Collapse, Divider, Tooltip } from '@mui/material';

// third-party
import { CopyToClipboard } from 'react-copy-to-clipboard';

// project import
import SyntaxHighlight from 'utils/SyntaxHighlight';
import IconButton from 'components/@extended/IconButton';

// assets
import { CodeOutlined, CopyOutlined } from '@ant-design/icons';

// ==============================|| CLIPBOARD & HIGHLIGHTER   ||============================== //

const Highlighter = ({ codeString, codeHighlight }) => {
	const [highlight, setHighlight] = useState(codeHighlight);

	return (
		<>
			<CardActions sx={{ justifyContent: 'flex-end' }}>
				<Box sx={{ display: 'flex' }}>
					<CopyToClipboard text={codeString}>
						<Tooltip title='Copy the source' placement='top-end'>
							<IconButton color='secondary' size='small' sx={{ fontSize: '0.875rem' }}>
								<CopyOutlined />
							</IconButton>
						</Tooltip>
					</CopyToClipboard>
					<Divider orientation='vertical' variant='middle' flexItem sx={{ mx: 1 }} />
					<Tooltip title='Show the source' placement='top-end'>
						<IconButton
							sx={{ fontSize: '0.875rem' }}
							size='small'
							color={highlight ? 'primary' : 'secondary'}
							onClick={() => setHighlight(!highlight)}
						>
							<CodeOutlined />
						</IconButton>
					</Tooltip>
				</Box>
			</CardActions>
			<Collapse in={highlight}>{highlight && <SyntaxHighlight>{codeString}</SyntaxHighlight>}</Collapse>
		</>
	);
};

Highlighter.propTypes = {
	codeHighlight: PropTypes.bool,
	codeString: PropTypes.string,
};

export default Highlighter;
