import PropTypes from 'prop-types';
import React, { forwardRef, useRef, useState } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import {
	Box,
	Checkbox,
	Chip,
	FormControl,
	Grid,
	ListItemText,
	MenuItem,
	OutlinedInput,
	Pagination,
	Select,
	Stack,
	TableCell,
	TableRow,
	Typography,
} from '@mui/material';

// assets
import { CaretUpOutlined, CaretDownOutlined, CheckOutlined } from '@ant-design/icons';

// ==============================|| HEADER HEADER ||============================== //

export const HeaderSort = ({ column, sort }) => {
	const theme = useTheme();
	return (
		<Stack direction='row' spacing={1} alignItems='center'>
			<Box sx={{ width: 'max-content' }}>{column.render('Header')}</Box>
			{!column.disableSortBy && (
				<Stack
					sx={{ color: 'secondary.light' }}
					{...(sort && { ...column.getHeaderProps(column.getSortByToggleProps()) })}
				>
					<CaretUpOutlined
						style={{
							fontSize: '0.625rem',
							color: column.isSorted && !column.isSortedDesc ? theme.palette.text.secondary : 'inherit',
						}}
					/>
					<CaretDownOutlined
						style={{
							fontSize: '0.625rem',
							marginTop: -2,
							color: column.isSortedDesc ? theme.palette.text.secondary : 'inherit',
						}}
					/>
				</Stack>
			)}
		</Stack>
	);
};

HeaderSort.propTypes = {
	column: PropTypes.any,
	sort: PropTypes.bool,
};

// ==============================|| TABLE PAGINATION ||============================== //

export const TablePagination = ({ pagination, page, limit, setPage, setLimit, gotoPage, setPageSize }) => {
	const [open, setOpen] = useState(false);

	const handleClose = () => {
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleChangePagination = (event, value) => {
		gotoPage(value);
		setPage(value);
	};

	const handleChange = (event) => {
		const { value } = event.target;

		setPage(1);
		setLimit(value);
		setPageSize(value);
	};

	return (
		<Grid container alignItems='center' justifyContent='space-between' sx={{ width: 'auto' }}>
			<Grid item>
				<Stack direction='row' spacing={1} alignItems='center'>
					<Stack direction='row' spacing={1} alignItems='center'>
						<Typography variant='caption' color='secondary'>
							Rows per page
						</Typography>
						<FormControl sx={{ m: 1 }}>
							<Select
								id='demo-controlled-open-select'
								open={open}
								onClose={handleClose}
								onOpen={handleOpen}
								value={limit}
								onChange={handleChange}
								size='small'
								sx={{ '& .MuiSelect-select': { py: 0.75, px: 1.25 } }}
							>
								<MenuItem value={5}>5</MenuItem>
								<MenuItem value={10}>10</MenuItem>
								<MenuItem value={25}>25</MenuItem>
								<MenuItem value={50}>50</MenuItem>
								<MenuItem value={100}>100</MenuItem>
							</Select>
						</FormControl>
					</Stack>
					<Typography variant='caption' color='secondary'>
						Total count: {pagination?.totalCount}
					</Typography>
				</Stack>
			</Grid>
			<Grid item sx={{ mt: { xs: 2, sm: 0 } }}>
				<Pagination
					count={pagination?.totalPages}
					page={page}
					onChange={handleChangePagination}
					color='primary'
					variant='combined'
					showFirstButton
					showLastButton
				/>
			</Grid>
		</Grid>
	);
};

TablePagination.propTypes = {
	pagination: PropTypes.object,
	page: PropTypes.number,
	limit: PropTypes.number,
	setPage: PropTypes.func,
	setLimit: PropTypes.func,
	gotoPage: PropTypes.func,
	setPageSize: PropTypes.func,
};

// ==============================|| SELECTION - PREVIEW ||============================== //

export const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
	const defaultRef = useRef();
	const resolvedRef = ref || defaultRef;

	return <Checkbox indeterminate={indeterminate} ref={resolvedRef} {...rest} />;
});

IndeterminateCheckbox.propTypes = {
	indeterminate: PropTypes.bool,
};

export const TableRowSelection = ({ selected }) => (
	<>
		{selected > 0 && (
			<Chip
				size='small'
				// @ts-ignore
				label={`${selected} row(s) selected`}
				color='secondary'
				variant='light'
				sx={{
					position: 'absolute',
					right: -1,
					top: -1,
					borderRadius: '0 4px 0 4px',
				}}
			/>
		)}
	</>
);

TableRowSelection.propTypes = {
	selected: PropTypes.number,
};

// ==============================|| COLUMN HIDING - SELECT ||============================== //

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 200,
		},
	},
};

export const HidingSelect = ({ hiddenColumns, setHiddenColumns, allColumns }) => {
	const handleChange = (event) => {
		const {
			target: { value },
		} = event;

		setHiddenColumns(typeof value === 'string' ? value.split(',') : value);
	};

	const theme = useTheme();
	let visible = allColumns.filter((c) => !hiddenColumns.includes(c.id)).length;

	return (
		<FormControl sx={{ width: 200 }}>
			<Select
				id='column-hiding'
				multiple
				displayEmpty
				value={hiddenColumns}
				onChange={handleChange}
				input={<OutlinedInput id='select-column-hiding' placeholder='select column' />}
				renderValue={(selected) => {
					if (selected.length === 0) {
						return <Typography variant='subtitle1'>All columns visible</Typography>;
					}

					if (selected.length > 0 && selected.length === allColumns.length) {
						return <Typography variant='subtitle1'>All columns visible</Typography>;
					}

					return <Typography variant='subtitle1'>{visible} column(s) visible</Typography>;
				}}
				MenuProps={MenuProps}
				size='small'
			>
				{allColumns.map((column) => {
					let ToggleChecked = column.id === '#' ? true : hiddenColumns.indexOf(column.id) > -1 ? false : true;
					return (
						<MenuItem
							key={column.id}
							value={column.id}
							sx={{ bgcolor: 'success.lighter', '&.Mui-selected': { bgcolor: 'background.paper' } }}
						>
							<Checkbox
								checked={ToggleChecked}
								color='success'
								checkedIcon={
									<Box
										className='icon'
										sx={{
											width: 16,
											height: 16,
											border: '1px solid',
											borderColor: 'inherit',
											borderRadius: 0.25,
											position: 'relative',
											backgroundColor: theme.palette.success.main,
										}}
									>
										<CheckOutlined
											className='filled'
											style={{ position: 'absolute', color: theme.palette.common.white }}
										/>
									</Box>
								}
							/>
							<ListItemText primary={typeof column.Header === 'string' ? column.Header : column?.title} />
						</MenuItem>
					);
				})}
			</Select>
		</FormControl>
	);
};

HidingSelect.propTypes = {
	setHiddenColumns: PropTypes.func,
	hiddenColumns: PropTypes.array,
	allColumns: PropTypes.array,
};

// ==============================|| COLUMN SORTING - SELECT ||============================== //

export const SortingSelect = ({ sortBy, setSortBy, allColumns }) => {
	const [sort, setSort] = useState(sortBy);

	const handleChange = (event) => {
		const {
			target: { value },
		} = event;
		setSort(value);
		setSortBy([{ id: value, desc: false }]);
	};

	return (
		<FormControl sx={{ width: 200 }}>
			<Select
				id='column-hiding'
				displayEmpty
				value={sort}
				onChange={handleChange}
				input={<OutlinedInput id='select-column-hiding' placeholder='Sort by' />}
				renderValue={(selected) => {
					const selectedColumn = allColumns.filter((column) => column.id === selected)[0];
					if (!selected) {
						return <Typography variant='subtitle1'>Sort By</Typography>;
					}

					return (
						<Typography variant='subtitle2'>
							Sort by (
							{typeof selectedColumn.Header === 'string' ? selectedColumn.Header : selectedColumn?.title})
						</Typography>
					);
				}}
				size='small'
			>
				{allColumns
					.filter((column) => column.canSort)
					.map((column) => (
						<MenuItem key={column.id} value={column.id}>
							<ListItemText primary={typeof column.Header === 'string' ? column.Header : column?.title} />
						</MenuItem>
					))}
			</Select>
		</FormControl>
	);
};

SortingSelect.propTypes = {
	setSortBy: PropTypes.func,
	sortBy: PropTypes.string,
	allColumns: PropTypes.array,
};

// ==============================|| EMPTY TABLE - NO DATA  ||============================== //

const StyledGridOverlay = styled(Stack)(({ theme }) => ({
	height: '400px',
	'& .ant-empty-img-1': {
		fill: theme.palette.mode === 'light' ? theme.palette.secondary[400] : theme.palette.secondary[200],
	},
	'& .ant-empty-img-2': {
		fill: theme.palette.mode === 'light' ? theme.palette.secondary.light : theme.palette.secondary.light,
	},
	'& .ant-empty-img-3': {
		fill: theme.palette.mode === 'light' ? theme.palette.secondary[200] : theme.palette.secondary.A200,
	},
	'& .ant-empty-img-4': {
		fill: theme.palette.mode === 'light' ? theme.palette.secondary.A100 : theme.palette.secondary.A300,
	},
	'& .ant-empty-img-5': {
		fillOpacity: theme.palette.mode === 'light' ? '0.95' : '0.09',
		fill: theme.palette.mode === 'light' ? theme.palette.secondary.light : theme.palette.secondary.darker,
	},
}));

export const EmptyTable = ({ msg, colSpan }) => {
	return (
		<TableRow>
			<TableCell colSpan={colSpan}>
				<StyledGridOverlay alignItems='center' justifyContent='center' spacing={1}>
					<svg width='120' height='100' viewBox='0 0 184 152' aria-hidden focusable='false'>
						<g fill='none' fillRule='evenodd'>
							<g transform='translate(24 31.67)'>
								<ellipse className='ant-empty-img-5' cx='67.797' cy='106.89' rx='67.797' ry='12.668' />
								<path
									className='ant-empty-img-1'
									d='M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z'
								/>
								<path
									className='ant-empty-img-2'
									d='M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z'
								/>
								<path
									className='ant-empty-img-3'
									d='M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z'
								/>
							</g>
							<path
								className='ant-empty-img-3'
								d='M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z'
							/>
							<g className='ant-empty-img-4' transform='translate(149.65 15.383)'>
								<ellipse cx='20.654' cy='3.167' rx='2.849' ry='2.815' />
								<path d='M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z' />
							</g>
						</g>
					</svg>
					<Typography align='center' color='secondary'>
						{msg}
					</Typography>
				</StyledGridOverlay>
			</TableCell>
		</TableRow>
	);
};

EmptyTable.propTypes = {
	msg: PropTypes.string,
	colSpan: PropTypes.number,
};
