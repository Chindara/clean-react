import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// ASSETS
import { EditOutlined, MoreVertOutlined, AccountBalanceOutlined, RocketLaunchOutlined } from '@mui/icons-material';

// MUI
import { useTheme } from '@mui/material/styles';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';

// PROJECT IMPORT
import IconButton from 'components/@extended/IconButton';

// CONSTANTS
import { KEBAB_MENU_MODE, OPERATION_MODE } from 'constants/Types';

// ==============================|| KEBAB MENU ||============================== //
export default function KebabMenu({ row }) {
	const theme = useTheme();
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClose = () => setAnchorEl(null);

	return (
		<>
			<IconButton size='small' aria-controls={`actions - ${row}`} onClick={(event) => setAnchorEl(event?.currentTarget)} aria-haspopup='true' color='secondary'>
				<MoreVertOutlined fontSize='small' style={{ color: theme.palette.text.primary }} />
			</IconButton>
			<Menu
				id={`actions - ${row}`}
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
				variant='selectedMenu'
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				<MenuItem
					onClick={() => {
						handleClose();
						navigate(`form?mode=${OPERATION_MODE.Edit}&id=${row?.original?.id}`);
					}}
				>
					<ListItemIcon sx={{ '&.MuiListItemIcon-root': { minWidth: '23px' } }}>
						<EditOutlined fontSize='small' />
					</ListItemIcon>
					<ListItemText>Edit</ListItemText>
				</MenuItem>
				<MenuItem
					onClick={() => {
						console.log('row.original', row?.original);
						handleClose();
						navigate(`bank/${row?.original?.id}`, { state: row?.original });
					}}
				>
					<ListItemIcon sx={{ '&.MuiListItemIcon-root': { minWidth: '23px' } }}>
						<AccountBalanceOutlined fontSize='small' />
					</ListItemIcon>
					<ListItemText>Bank</ListItemText>
				</MenuItem>
				<MenuItem
					onClick={() => {
						handleClose();
						navigate(`history/${row?.original?.id}`);
					}}
				>
					<ListItemIcon sx={{ '&.MuiListItemIcon-root': { minWidth: '23px' } }}>
						<RocketLaunchOutlined fontSize='small' />
					</ListItemIcon>
					<ListItemText>History</ListItemText>
				</MenuItem>
			</Menu>
		</>
	);
}

KebabMenu.propTypes = {
	row: PropTypes.object.isRequired,
};
