import React from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
	CardMedia,
	FormControlLabel,
	Grid,
	Radio,
	RadioGroup,
	Stack,
	Typography,
	useMediaQuery,
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import useConfig from 'hooks/useConfig';
import { dispatch } from 'store';
import { openDrawer } from 'store/reducers/menu';

// assets
import defaultLayout from 'assets/images/customization/default.svg';
import containerLayout from 'assets/images/customization/container.svg';
import { LAYOUT_CONST } from '../../../config';

// ==============================|| CUSTOMIZATION - CONTAINER ||============================== //

const ThemeMenuLayout = () => {
	const theme = useTheme();
	const downLG = useMediaQuery(theme.breakpoints.down('lg'));

	const { menuOrientation, onChangeMenuOrientation, onChangeMiniDrawer, onChangeDirection } = useConfig();
	const isHorizontal = menuOrientation === LAYOUT_CONST.HORIZONTAL_LAYOUT && !downLG;

	const handleContainerChange = (e) => {
		if (e.target.value === 'horizontal') {
			onChangeMiniDrawer(true);
			onChangeDirection('ltr');
			onChangeMenuOrientation(e.target.value);
			dispatch(openDrawer({ drawerOpen: false }));
		} else {
			onChangeMiniDrawer(true);
			onChangeDirection('ltr');
			onChangeMenuOrientation(e.target.value);
			dispatch(openDrawer({ drawerOpen: true }));
		}
	};

	return (
		<RadioGroup
			row
			aria-label='payment-card'
			name='payment-card'
			value={menuOrientation}
			onChange={handleContainerChange}
		>
			<Grid container spacing={1.75} sx={{ ml: 0 }}>
				<Grid item>
					<FormControlLabel
						control={<Radio value='vertical' sx={{ display: 'none' }} />}
						sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
						label={
							<MainCard
								content={false}
								sx={{ bgcolor: !isHorizontal ? 'primary.lighter' : 'secondary.lighter', p: 1 }}
								border={false}
								{...(!isHorizontal && { boxShadow: true, shadow: theme.customShadows.primary })}
							>
								<Stack spacing={1.25} alignItems='center'>
									<CardMedia
										component='img'
										src={defaultLayout}
										alt='Vertical'
										sx={{ borderRadius: 1, width: 64, height: 64 }}
									/>
									<Typography variant='caption'>Vertical</Typography>
								</Stack>
							</MainCard>
						}
					/>
				</Grid>
				<Grid item>
					<FormControlLabel
						control={<Radio value='horizontal' sx={{ display: 'none' }} />}
						sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
						label={
							<MainCard
								content={false}
								sx={{ bgcolor: isHorizontal ? 'primary.lighter' : 'secondary.lighter', p: 1 }}
								border={false}
								{...(isHorizontal && { boxShadow: true, shadow: theme.customShadows.primary })}
							>
								<Stack spacing={1.25} alignItems='center'>
									<CardMedia
										component='img'
										src={containerLayout}
										alt='horizontal'
										sx={{ borderRadius: 1, width: 64, height: 64 }}
									/>
									<Typography variant='caption'>Horizontal</Typography>
								</Stack>
							</MainCard>
						}
					/>
				</Grid>
			</Grid>
		</RadioGroup>
	);
};

export default ThemeMenuLayout;
