import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// ASSETS
import { EditOutlined, MoreVertOutlined, ChangeCircleOutlined, PaymentOutlined, VerifiedUserOutlined, TollOutlined, Payments } from '@mui/icons-material';
import PaymentsIcon from '@mui/icons-material/Payments';
// MUI
import { useTheme } from '@mui/material/styles';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';

// PROJECT IMPORT
import IconButton from 'components/@extended/IconButton';

// CONSTANTS
import { KEBAB_MENU_MODE, OPERATION_MODE } from 'constants/Types';

// ==============================|| KEBAB MENU ||============================== //
export default function KebabMenu({ row, handleClick }) {
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
						<EditOutlined fontSize='small' style={{ color: theme.palette.text.primary }} />
					</ListItemIcon>
					<ListItemText>Edit</ListItemText>
				</MenuItem>
				<MenuItem
					onClick={() => {
						handleClose();
						handleClick(KEBAB_MENU_MODE.Other, row?.original?.id);
					}}
				>
					<ListItemIcon sx={{ '&.MuiListItemIcon-root': { minWidth: '23px' } }}>
						<ChangeCircleOutlined fontSize='small' style={{ color: theme.palette.text.primary }} />
					</ListItemIcon>
					<ListItemText>Change Status</ListItemText>
				</MenuItem>
				<MenuItem
					onClick={() => {
						handleClose();
						navigate(`logisticsInvoice?id=${row?.original?.id}`);
					}}
				>
					<ListItemIcon sx={{ '&.MuiListItemIcon-root': { minWidth: '23px' } }}>
						<Payments fontSize='small' style={{ color: theme.palette.text.primary }} />
					</ListItemIcon>
					<ListItemText>Logistics Invoices</ListItemText>
				</MenuItem>
				<MenuItem
					onClick={() => {
						handleClose();
						navigate(`duty?id=${row?.original?.id}`);
					}}
				>
					<ListItemIcon sx={{ '&.MuiListItemIcon-root': { minWidth: '23px' } }}>
						<TollOutlined fontSize='small' style={{ color: theme.palette.text.primary }} />
					</ListItemIcon>
					<ListItemText>Duty</ListItemText>
				</MenuItem>
				<MenuItem
					onClick={() => {
						handleClose();
						navigate(`guarantee?id=${row?.original?.id}`);
					}}
				>
					<ListItemIcon sx={{ '&.MuiListItemIcon-root': { minWidth: '23px' } }}>
						<VerifiedUserOutlined fontSize='small' style={{ color: theme.palette.text.primary }} />
					</ListItemIcon>
					<ListItemText>Guarantee</ListItemText>
				</MenuItem>
			</Menu>
		</>
	);
}

KebabMenu.propTypes = {
	row: PropTypes.object.isRequired,
	handleClick: PropTypes.func.isRequired,
};
