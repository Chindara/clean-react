import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// MUI
import { useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, useMediaQuery } from '@mui/material';

// PROJECT IMPORT

import AppBarStyled from 'containers/header/header-styles/AppBarStyled';
import HeaderContent from 'containers/header/header-content/HeaderContent';
import useConfig from 'hooks/useConfig';
import IconButton from 'components/@extended/IconButton';
import { LAYOUT_CONST } from '../config';

// ASSETS
import { MenuFoldOutlined, MenuUnfoldOutlined, HomeOutlined } from '@ant-design/icons';
import { dispatch, useSelector } from 'store';

import { changeOfficerView } from 'store/reducers/menu';
import { USER_TYPE } from 'constants/Types';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

const Header = ({ open, handleDrawerToggle }) => {
	const theme = useTheme();
	const navigate = useNavigate();

	const downLG = useMediaQuery(theme.breakpoints.down('lg'));
	const { menuOrientation } = useConfig();
	const { officerView, companyName, userType } = useSelector((state) => state.menu);

	const isHorizontal = menuOrientation === LAYOUT_CONST.HORIZONTAL_LAYOUT && !downLG;

	// header content
	const headerContent = useMemo(() => <HeaderContent />, []);

	const iconBackColorOpen = theme.palette.mode === 'dark' ? 'grey.200' : 'grey.300';
	const iconBackColor = theme.palette.mode === 'dark' ? 'background.default' : 'grey.100';

	const handleHome = () => {
		dispatch(changeOfficerView({ officerView: true }));

		navigate('/company-homes', { preventScrollReset: true, replace: true });
	};

	// common header
	const mainHeader = (
		<Toolbar>
			{!officerView && !isHorizontal ? (
				<>
					<IconButton
						aria-label='open drawer'
						onClick={handleDrawerToggle}
						edge='start'
						color='secondary'
						variant='light'
						sx={{
							color: 'text.primary',
							bgcolor: open ? iconBackColorOpen : iconBackColor,
							ml: { xs: 0, lg: -2 },
						}}
					>
						{!open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
					</IconButton>

					{Number(userType) === USER_TYPE.OFFICER && (
						<IconButton
							aria-label='open home'
							onClick={handleHome}
							edge='start'
							color='secondary'
							variant='light'
							sx={{
								color: 'text.primary',
								bgcolor: open ? iconBackColorOpen : iconBackColor,
								ml: { xs: 1, lg: 1 },
							}}
						>
							<HomeOutlined />
						</IconButton>
					)}

					<Typography variant='body1' sx={{ pl: 1, width: '100%' }}>{`/ ${companyName}`}</Typography>
				</>
			) : null}
			{headerContent}
		</Toolbar>
	);

	// app-bar params
	const appBar = {
		position: 'fixed',
		color: 'inherit',
		elevation: 0,
		sx: {
			borderBottom: `1px solid ${theme.palette.divider}`,
			zIndex: 1200,
			width: isHorizontal || officerView ? '100%' : open ? 'calc(100% - 260px)' : { xs: '100%', lg: 'calc(100% - 60px)' },
			// boxShadow: theme.customShadows.z1
		},
	};

	return (
		<>
			{!downLG ? (
				<AppBarStyled open={open} {...appBar}>
					{mainHeader}
				</AppBarStyled>
			) : (
				<AppBar {...appBar}>{mainHeader}</AppBar>
			)}
		</>
	);
};

Header.propTypes = {
	open: PropTypes.bool,
	handleDrawerToggle: PropTypes.func,
};

export default Header;
