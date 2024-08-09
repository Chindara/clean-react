import PropTypes from 'prop-types';
import React, { useState, forwardRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, Stack, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const SearchBar = forwardRef(({ children, searchVisible, setSearchVisible, canClose }, ref) => {
	const theme = useTheme();

	const handleVisible = () => {
		setSearchVisible(!searchVisible);
	};

	return (
		<>
			{searchVisible && (
				<Card
					elevation={0}
					ref={ref}
					sx={{
						backgroundColor: theme.palette.grey[100],
						borderRadius: 2,
						border: 'none',
						marginBottom: 1,
						padding: 1,
					}}
				>
					<Stack direction='row' alignItems='center' justifyContent='space-between'>
						<Stack direction='row' alignItems='center' justifyContent='flex-start' spacing={1}>
							{children}
						</Stack>
						{canClose && (
							<IconButton aria-label='fingerprint' color='secondary' onClick={handleVisible}>
								<CloseIcon />
							</IconButton>
						)}
					</Stack>
				</Card>
			)}
		</>
	);
});

SearchBar.propTypes = {
	children: PropTypes.node,
	searchVisible: PropTypes.bool,
	setSearchVisible: PropTypes.func,
	canClose: PropTypes.bool,
};

SearchBar.defaultProps = {
	canClose: true,
};

export default SearchBar;
