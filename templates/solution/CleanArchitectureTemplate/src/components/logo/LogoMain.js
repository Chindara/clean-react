import React from 'react';
import PropTypes from 'prop-types';

// MUI
import { useTheme } from '@mui/material/styles';

// ASSETS
// import darkLogo from '../../assets/images/logos/shiptrak-light-logo.svg';
// import lightLogo from '../../assets/images/logos/shiptrak-dark-logo.svg';

import darkLogo from '../../assets/images/logos/esip-dark-logo.svg';
import lightLogo from '../../assets/images/logos/esip-light-logo.svg';

// ==============================|| LOGO SVG ||============================== //

const LogoMain = ({ reverse }) => {
	const theme = useTheme();

	return (
		<>
			<img src={theme.palette.mode === 'dark' ? lightLogo : darkLogo} alt='ShipTrak Pro' width='190' />
		</>
	);
};

LogoMain.propTypes = {
	reverse: PropTypes.bool,
};

export default LogoMain;
