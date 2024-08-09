import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import useAuth from 'hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import DashboardService from 'services/DashboardService';
import { Chip, Grid, InputLabel, Link, ToggleButton, ToggleButtonGroup } from '@mui/material';
import MainCard from 'components/MainCard';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import breadcrumbItems from 'containers/menu-items/breadcrumbs';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { Button, Divider, Stack } from '@mui/material';
import moment from 'moment';
import { PAGINATION_PROPERTIES, SHIPMENT_STATUS_COLOR } from 'constants/Common';
import SimpleBar from 'components/third-party/SimpleBar';
import ReactTable from 'components/ui/ReactTable';
import ReportCard from 'components/cards/statistics/ReportCard';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import DirectionsBoatOutlinedIcon from '@mui/icons-material/DirectionsBoatOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { DASHBOARD_TILES_STATE } from 'common/state/dashboard-state';

export default function DashboardForm() {
	const theme = useTheme();
	const { companyId } = useAuth();
	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);
	const [shipmentStatus, setShipmentStatus] = useState({ labels: [], series: [] });
	const [purchaseStatus, setPurchaseStatus] = useState({ labels: [], series: [] });
	const [arrivalStatus, setArrivalStatus] = useState({ labels: [], series: [] });
	const [tileCounts, setTileCounts] = useState(DASHBOARD_TILES_STATE);
	const [startDate, setStartDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
	const [endDate, setEndDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
	const [lcExpirations, setLCExpirations] = useState([]);
	const [dateName, setDateName] = useState('Today');

	const [rangeMode, setRangeMode] = React.useState('today');

	const handleChange = (event, selectedRange) => {
		setRangeMode(selectedRange);

		const currentDate = new Date();
		let startDate = null;
		let endDate = null;
		let dateName = 'Today';

		switch (selectedRange) {
			case 'week':
				startDate = moment(currentDate).startOf('week').format('YYYY-MM-DD');
				endDate = moment(currentDate).endOf('week').format('YYYY-MM-DD');
				dateName = 'This Week';
				break;
			case 'month':
				startDate = moment(currentDate).startOf('month').format('YYYY-MM-DD');
				endDate = moment(currentDate).endOf('month').format('YYYY-MM-DD');
				dateName = 'This Month';
				break;
			case 'year':
				startDate = moment(currentDate).startOf('year').format('YYYY-MM-DD');
				endDate = moment(currentDate).endOf('year').format('YYYY-MM-DD');
				dateName = 'This Year';
				break;
			default:
				startDate = moment(currentDate).format('YYYY-MM-DD');
				endDate = moment(currentDate).format('YYYY-MM-DD');
				dateName = 'Today';
				break;
		}

		setStartDate(startDate);
		setEndDate(endDate);
		setDateName(dateName);
	};

	const {
		data: { shipments, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['upcomingShipments', { page, limit }],
		queryFn: () => getShipments(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { shipments: [], pagination: {} },
	});

	const getShipments = async () => {
		const { data: { items = [], ...pagination } = {} } = await DashboardService.getUpcomingShipments(companyId, moment(new Date()).format('YYYY-MM-DD'));
		return { shipments: items, pagination: pagination };
	};

	useEffect(() => {
		(async () => {
			try {
				if (startDate && endDate) {
					const getShipmentStatus = DashboardService.getShipmentStatus(companyId, startDate, endDate);
					const getPurchaseStatus = DashboardService.getPurchaseStatus(companyId, startDate, endDate);
					const getArrivalStatus = DashboardService.getArrivalStatus(companyId, startDate, endDate);
					const getTileCounts = DashboardService.getTileCounts(companyId, startDate, endDate);
					const getLCExpirations = DashboardService.getLCExpirations(companyId, startDate, endDate);

					const [shipmentStatus = {}, purchaseStatus = {}, arrivalStatus = {}, tileCounts = {}, lcExpirations = {}] = await Promise.all([
						getShipmentStatus,
						getPurchaseStatus,
						getArrivalStatus,
						getTileCounts,
						getLCExpirations,
					]);

					setShipmentStatus(shipmentStatus?.data);
					setArrivalStatus(arrivalStatus?.data);
					setPurchaseStatus(purchaseStatus?.data);
					setTileCounts(tileCounts?.data);
					setLCExpirations(lcExpirations?.data.items);
				}
			} catch (error) {
				console.error(error);
			}
		})();
	}, [companyId, startDate, endDate]);

	const shipmentOptions = {
		labels: shipmentStatus?.labels || [],
		//colors: shipmentStatus?.colors || [theme.palette.success.dark, theme.palette.error.dark],	
		colors: shipmentStatus?.colors || [ '#04E395' , '#FA7070'],		
		chart: {
			type: 'pie',
		},
		plotOptions: {
			pie: {
				donut: {
					size: '50%',
				},
				dataLabels: {
					enabled: false,
				},
			},
		},
		dataLabels: {
			enabled: true,
			textAnchor: 'end',
			dropShadow: {
				enabled: false,
			},
			// formatter: function (val, opt) {
			// 	console.log('val', val);
			// 	console.log('opt', opt);

			// 	return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val;
			// },
		},
		fill: {
			colors: ['#04E395' , '#FA7070'],
		},
		responsive: [
			{
				breakpoint: 720,
				options: {
					chart: {
						width: 400,
						height: 250,
					},
					legend: {
						show: false,
					},
				},
			},
		],
		legend: {
			position: 'bottom',
			horizontalAlign: 'center',
			fontSize: '12px',
			fontFamily: theme.typography.fontFamily,
		},
		title: {
			text: 'Shipment Status',
			align: 'left',
			margin: 10,
			style: {
				fontSize: '16px',
				fontWeight: theme.typography.fontWeightBold,
				fontFamily: theme.typography.fontFamily,
				color: theme.typography.color,
			},
		},
		noData: {
			text: 'No Data Available',
			align: 'center',
			verticalAlign: 'middle',
			margin: 10,
			style: {
				fontSize: '14px',
				fontWeight: theme.typography.fontWeightBold,
				fontFamily: theme.typography.fontFamily,
				color: theme.palette.secondary.light,
			},
		},
	};

	const purchaseOptions = {
		chart: {
			type: 'bar',
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '60%',
				endingShape: 'rounded',
			},
		},
		xaxis: {
			categories: purchaseStatus?.labels || ['Outstanding', 'InProgress', 'Partial', 'Cleared'],
		},
		dataLabels: {
			enabled: true,
			textAnchor: 'end',
			dropShadow: {
				enabled: false,
			},
		},
		colors: [
			function({ value, seriesIndex, dataPointIndex, w }) {
				const category = w.globals.labels[dataPointIndex];
				switch (category) {
					case 'Outstanding':
						return '#EB5353'; 
					case 'InProgress':
						return '#F9D923';
					case 'Cleared':
						return '#36AE7C'; 
					default:
						return '#187498'; 
				}
			}
		],		
		responsive: [
			{
				breakpoint: 720,
				options: {
					chart: {
						width: 400,
					},
					legend: {
						show: false,
					},
				},
			},
		],
		fill: {
			opacity: 1,
		},
		title: {
			text: 'Purchase Order Status',
			align: 'left',
			margin: 10,
			style: {
				fontSize: '16px',
				fontWeight: theme.typography.fontWeightBold,
				fontFamily: theme.typography.fontFamily,
				color: theme.typography.color,
			},
		},
		noData: {
			text: 'No Data Available',
			align: 'center',
			verticalAlign: 'middle',
			margin: 10,
			style: {
				fontSize: '14px',
				fontWeight: theme.typography.fontWeightBold,
				fontFamily: theme.typography.fontFamily,
				color: theme.palette.secondary.light,
			},
		},
	};

	const arrivalOptions = {
		chart: {
			type: 'bar',
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '60%',
				endingShape: 'rounded',
			},
		},
		xaxis: {
			categories: arrivalStatus?.labels || ['FCL', 'LCL', 'Courier', 'AF', 'Bulk'],
		},
		colors: [
			function({ value, seriesIndex, dataPointIndex, w }) {
				const category = w.globals.labels[dataPointIndex];
				switch (category) {
					case 'FCL':
						return '#074173'; 
					case 'LCL':
						return '#1679AB';
					case 'Courier':
						return '#5DEBD7'; 
					case 'AF':
						return '#C5FF95'; 
					default:
						return '#EFF396'; 
				}
			}
		],		
		dataLabels: {
			enabled: true,
			textAnchor: 'end',
			dropShadow: {
				enabled: false,
			},
		},
		//colors: [theme.palette.primary.main],
		responsive: [
			{
				breakpoint: 720,
				options: {
					chart: {
						width: 400,
					},
					legend: {
						show: false,
					},
				},
			},
		],
		fill: {
			opacity: 1,
		},
		title: {
			text: 'Arrival Status',
			align: 'left',
			margin: 10,
			style: {
				fontSize: '16px',
				fontWeight: theme.typography.fontWeightBold,
				fontFamily: theme.typography.fontFamily,
				color: theme.typography.color,
			},
		},
		noData: {
			text: 'No Data Available',
			align: 'center',
			verticalAlign: 'middle',
			margin: 10,
			style: {
				fontSize: '14px',
				fontWeight: theme.typography.fontWeightBold,
				fontFamily: theme.typography.fontFamily,
				color: theme.palette.secondary.light,
			},
		},
	};

	const columnsShipments = useMemo(
		() => [
			{
				Header: 'Reference No',
				accessor: 'referenceNo',
			},
			{
				Header: 'purchase No',
				accessor: 'purchaseNo',
			},
			{
				Header: 'vendor',
				accessor: 'vendor',
			},
			{
				Header: 'nop',
				accessor: 'natureOfPurchase',
			},
			{
				Header: 'Amount',
				accessor: 'amount',
				Cell: ({ row }) => (
					<InputLabel style={{ float: 'right' }}>
						{row.original.currency}&nbsp;
						{row.original.amount}
					</InputLabel>
				),
			},
			{
				Header: 'Weight',
				accessor: 'weight',
			},
			{
				Header: 'Vessel',
				accessor: 'vessel',
			},
			{
				Header: 'inco Term',
				accessor: 'incoTerm',
			},
			{
				Header: 'shipment Type',
				accessor: 'shipmentType',
			},
			{
				Header: 'eta',
				accessor: 'eta',
			},
			{
				Header: 'Status',
				accessor: 'status',
				Cell: ({ value }) => <Chip label={value} size='small' variant='light' color={SHIPMENT_STATUS_COLOR[value] ?? 'default'} />,
			},
		],
		[]
	);

	const columnsLCExpirations = useMemo(
		() => [
			{
				Header: 'purchase No',
				accessor: 'purchaseNo',
			},
			{
				Header: 'vendor',
				accessor: 'vendor',
			},
			{
				Header: 'country',
				accessor: 'country',
			},
			{
				Header: 'inco Term',
				accessor: 'incoTerm',
			},
			{
				Header: 'shipment Type',
				accessor: 'shipmentType',
			},
			{
				Header: 'lc No',
				accessor: 'lcNo',
			},
			{
				Header: 'issue Date',
				accessor: 'issueDate',
			},
			{
				Header: 'expiry Date',
				accessor: 'expiryDate',
			},
			{
				Header: 'Amount',
				accessor: 'amount',
				Cell: ({ row }) => (
					<InputLabel style={{ float: 'right' }}>
						{row.original.currency}&nbsp;
						{row.original.amount}
					</InputLabel>
				),
			},
		],
		[]
	);

	return (
		<>
			<Stack spacing={2}>
				<Stack direction='row' alignItems='flex-start' justifyContent='space-between'>
					<Breadcrumbs navigation={breadcrumbItems} />
					<ToggleButtonGroup color='primary' value={rangeMode} size='small' exclusive onChange={handleChange} aria-label='Filters'>
						<ToggleButton value='today' aria-label='today'>
							Today
						</ToggleButton>
						<ToggleButton value='week' aria-label='week'>
							This Week
						</ToggleButton>
						<ToggleButton value='month' aria-label='month'>
							This Month
						</ToggleButton>
						<ToggleButton value='year' aria-label='year'>
							This Year
						</ToggleButton>
					</ToggleButtonGroup>
				</Stack>
			</Stack>

			<Grid container spacing={2}>
				<Grid container item spacing={2}>
					<Grid item xs={12} lg={3} sm={6}>
						<ReportCard
							primary={tileCounts?.totalPurchaseOrders.toString() || 'N/A'}
							secondary='Total Open Purchase Orders'
							color={theme.palette.primary.main}
							iconPrimary={ReceiptOutlinedIcon}
						/>
					</Grid>
					<Grid item xs={12} lg={3} sm={6}>
						<ReportCard
							primary={tileCounts?.currentPurchaseOrders.toString() || 'N/A'}
							secondary={`${dateName} Open Purchase Orders`}
							color={theme.palette.primary.main}
							iconPrimary={ReceiptOutlinedIcon}
						/>
					</Grid>
					<Grid item xs={12} lg={3} sm={6}>
						<ReportCard
							primary={tileCounts?.currentAdvancePayments.toString() || 'N/A'}
							secondary={`${dateName} No of Advanced Payments`}
							color={theme.palette.primary.main}
							iconPrimary={AccountBalanceWalletOutlinedIcon}
						/>
					</Grid>
					<Grid item xs={12} lg={3} sm={6}>
						<ReportCard
							primary={tileCounts?.currentShipments.toString() || 'N/A'}
							secondary={`${dateName} Shipments`}
							color={theme.palette.primary.main}
							iconPrimary={DirectionsBoatOutlinedIcon}
						/>
					</Grid>
				</Grid>

				<Grid container item spacing={2}>
					<Grid item xs={12} sm={4}>
						<MainCard sx={{ height: '300px' }}>
							<Chart options={purchaseOptions} series={purchaseStatus?.series || []} type='bar' height={280} />
						</MainCard>
					</Grid>
					<Grid item xs={12} sm={4}>
						<MainCard sx={{ height: '300px' }}>
							<Chart options={shipmentOptions} series={shipmentStatus?.series || []} type='pie' height={300} />
						</MainCard>
					</Grid>
					<Grid item xs={12} sm={4}>
						<MainCard sx={{ height: '300px' }}>
							<Chart options={arrivalOptions} series={arrivalStatus?.series || []} type='bar' height={280} />
						</MainCard>
					</Grid>
				</Grid>

				<Grid container item spacing={2}>
					<Grid item xs={12} sm={12}>
						<MainCard>
							<InputLabel
								sx={{
									margin: 1,
									fontSize: '16px',
									color: theme.palette.text.primary,
									fontWeight: theme.typography.fontWeightBold,
									fontFamily: theme.typography.fontFamily,
								}}
							>
								Upcoming Shipments
							</InputLabel>
							<SimpleBar>
								<ReactTable
									data={shipments}
									columns={columnsShipments}
									paginate={false}
									pagination={pagination}
									page={page}
									limit={limit}
									setPage={setPage}
									setLimit={setLimit}
									isFetching={isFetching}
								/>
							</SimpleBar>
						</MainCard>
					</Grid>
				</Grid>

				<Grid container item spacing={2}>
					<Grid item xs={12} sm={12}>
						<MainCard>
							<InputLabel
								sx={{
									margin: 1,
									fontSize: '16px',
									color: theme.palette.text.primary,
									fontWeight: theme.typography.fontWeightBold,
									fontFamily: theme.typography.fontFamily,
								}}
							>
								Upcoming LC Expirations
							</InputLabel>
							<SimpleBar>
								<ReactTable
									data={lcExpirations}
									columns={columnsLCExpirations}
									paginate={false}
									pagination={null}
									page={page}
									limit={limit}
									setPage={setPage}
									setLimit={setLimit}
									isFetching={isFetching}
								/>
							</SimpleBar>
						</MainCard>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
}

DashboardForm.propTypes = {
	row: PropTypes.shape({
		original: PropTypes.shape({
			amount: PropTypes.string,
			currency: PropTypes.string,
		}),
	}),
	value: PropTypes.any,
};
