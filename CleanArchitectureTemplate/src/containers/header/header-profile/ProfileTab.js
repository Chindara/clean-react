import React, { useState } from 'react';
import PropTypes from 'prop-types';

// MUI
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// ASSETS
import {
	EditOutlined,
	ProfileOutlined,
	LogoutOutlined,
	UserOutlined,
	WalletOutlined,
} from '@ant-design/icons';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const ProfileTab = ({ handleLogout }) => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const handleListItemClick = (event, index) => {
		setSelectedIndex(index);
	};

	return (
		<List component='nav' sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
			<ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
				<ListItemIcon>
					<EditOutlined />
				</ListItemIcon>
				<ListItemText primary='Edit Profile' />
			</ListItemButton>
			<ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
				<ListItemIcon>
					<UserOutlined />
				</ListItemIcon>
				<ListItemText primary='View Profile' />
			</ListItemButton>

			<ListItemButton selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3)}>
				<ListItemIcon>
					<ProfileOutlined />
				</ListItemIcon>
				<ListItemText primary='Social Profile' />
			</ListItemButton>
			<ListItemButton selected={selectedIndex === 4} onClick={(event) => handleListItemClick(event, 4)}>
				<ListItemIcon>
					<WalletOutlined />
				</ListItemIcon>
				<ListItemText primary='Billing' />
			</ListItemButton>
			<ListItemButton selected={selectedIndex === 2} onClick={handleLogout}>
				<ListItemIcon>
					<LogoutOutlined />
				</ListItemIcon>
				<ListItemText primary='Logout' />
			</ListItemButton>
		</List>
	);
};

ProfileTab.propTypes = {
	handleLogout: PropTypes.func,
};

export default ProfileTab;
