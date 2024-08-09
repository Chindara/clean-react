import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Typography, Card, CardMedia, CardActions, IconButton, CardContent, Grid, Tooltip } from '@mui/material';

import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import DirectionsBoatOutlinedIcon from '@mui/icons-material/DirectionsBoatOutlined';
import useAuth from 'hooks/useAuth';
import { dispatch } from 'store';
import { changeOfficerView, setCompanyName, setPurchaseBased } from 'store/reducers/menu';
import CompanyService from 'services/CompanyService';

export function CompanyHomeList() {
	const navigate = useNavigate();
	const { userCompanies, changeUserCompany } = useAuth();

	useEffect(() => {
		dispatch(changeOfficerView({ officerView: true }));
	}, []);

	const getCompanyById = async (companyId) => {
		const { data: { record = {} } = {} } = await CompanyService.getById(companyId);

		return { currentCompany: record };
	};

	const handleIconClick = async (companyId, companyName, redirectPath) => {
		changeUserCompany(companyId, companyName);
		dispatch(changeOfficerView({ officerView: false }));
		dispatch(setCompanyName({ companyName: companyName }));

		const { data: { record = {} } = {} } = await CompanyService.getById(companyId);

		dispatch(setPurchaseBased({ purchaseBased: record.isPurchaseBased }));

		navigate(redirectPath, { replace: true });
	};

	return (
		<Grid container spacing={2} justifyContent='flex-start'>
			{userCompanies.map((company) => (
				<Grid key={company.id} item xs={12} md={3}>
					<Card key={company.id}>
						<CardMedia
							component='img'
							height='200'
							image={`https://img.freepik.com/free-vector/company-employees-planning-task-brainstorming_74855-6316.jpg`}
							alt={`Logo for ${company.name}`}
						/>
						<CardContent>
							<Typography variant='h5' color='text.primary'>
								{company.name}
							</Typography>
						</CardContent>
						<CardActions disableSpacing>
							<Tooltip title='Dashboard'>
								<IconButton aria-label='dashboard' onClick={() => handleIconClick(company.id, company.name, '/dashboard')}>
									<DashboardOutlinedIcon />
								</IconButton>
							</Tooltip>
							{company.isPurchaseBased && (
								<>
									<Tooltip title='Purchase Orders'>
										<IconButton aria-label='purchase-order' onClick={() => handleIconClick(company.id, company.name, '/purchaseOrders')}>
											<ReceiptOutlinedIcon />
										</IconButton>
									</Tooltip>
									<Tooltip title='Shipments'>
										<IconButton aria-label='shipment' onClick={() => handleIconClick(company.id, company.name, '/shipment')}>
											<DirectionsBoatOutlinedIcon />
										</IconButton>
									</Tooltip>
								</>
							)}
							{!company.isPurchaseBased && (
								<Tooltip title='Shipments'>
									<IconButton aria-label='shipment' onClick={() => handleIconClick(company.id, company.name, '/nonPoShipments')}>
										<DirectionsBoatOutlinedIcon />
									</IconButton>
								</Tooltip>
							)}
							{/* <Tooltip title='Reports'>
								<IconButton aria-label='reports' onClick={() => handleIconClick(company.id, company.name, '/dashboard')}>
									<ArticleOutlinedIcon />
								</IconButton>
							</Tooltip> */}
						</CardActions>
					</Card>
				</Grid>
			))}
		</Grid>
	);
}

export default CompanyHomeList;
