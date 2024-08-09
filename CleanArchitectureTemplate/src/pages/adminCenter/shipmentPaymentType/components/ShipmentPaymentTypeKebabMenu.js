import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// ASSETS
import { EditOutlined, MoreVertOutlined, DeleteOutlined } from '@mui/icons-material';

// MUI
import { useTheme } from '@mui/material/styles';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';

// PROJECT IMPORT
import IconButton from 'components/@extended/IconButton';

// CONSTANTS
import { KEBAB_MENU_MODE } from 'constants/Types';

// ==============================|| KEBAB MENU ||============================== //
export default function ShipmentPaymentTypeKebabMenu({ row, handleClick }) {
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
						handleClick(KEBAB_MENU_MODE.Edit, row?.original?.id);
					}}
				>
					<ListItemIcon sx={{ '&.MuiListItemIcon-root': { minWidth: '23px' } }}>
						<EditOutlined fontSize='small' />
					</ListItemIcon>
					<ListItemText>Edit</ListItemText>
				</MenuItem>
				<MenuItem
					onClick={() => {
						handleClose();
						handleClick(KEBAB_MENU_MODE.Delete, row?.original?.id);
					}}
				>
					<ListItemIcon sx={{ '&.MuiListItemIcon-root': { minWidth: '23px' } }}>
						<DeleteOutlined fontSize='small' />
					</ListItemIcon>
					<ListItemText>Delete</ListItemText>
				</MenuItem>
			</Menu>
		</>
	);
}

ShipmentPaymentTypeKebabMenu.propTypes = {
	row: PropTypes.object.isRequired,
	handleClick: PropTypes.func.isRequired,
};
