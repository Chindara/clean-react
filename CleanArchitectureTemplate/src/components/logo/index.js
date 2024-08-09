import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React from 'react';

// material-ui
import { ButtonBase } from '@mui/material';

// project import
import LogoMain from './LogoMain';
import LogoIcon from './LogoIcon';
import config from '../../config';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ reverse, isIcon, sx, to }) => (
	<ButtonBase disableRipple component={Link} to={!to ? config.defaultPath : to} sx={sx}>
		{isIcon ? <LogoIcon /> : <LogoMain reverse={reverse} />}
	</ButtonBase>
);

LogoSection.propTypes = {
	reverse: PropTypes.bool,
	isIcon: PropTypes.bool,
	sx: PropTypes.object,
	to: PropTypes.string,
};

export default LogoSection;
