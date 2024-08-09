import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

// MUI
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Divider, Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

// REACT TABLE
import { useTable, useFilters, useSortBy, useRowSelect, usePagination } from 'react-table';
import { useSticky } from 'react-table-sticky';

// THIRD-PARTY
import { useDebounce } from 'use-debounce';

// PROJECT IMPORT
import { HeaderSort, TablePagination } from 'components/third-party/ReactTableFeatures';
import { DefaultColumnFilter, renderFilterTypes } from 'utils/react-table';

// ==============================|| REACT TABLE ||============================== //

// table style
const TableWrapper = styled('div')(() => ({
	'.header': {
		position: 'sticky',
		zIndex: 1,
		width: 'fit-content',
	},
	'& th[data-sticky-td]': {
		position: 'sticky',
		zIndex: '5 !important',
	},
}));
export default function ReactTable({
	initialState,
	data,
	columns,
	striped,
	sorting,
	paginate,
	selection,
	pagination,
	page,
	isFetching,
	limit,
	setPage,
	setLimit,
	setSelectedRows,
	filterable,
}) {
	const theme = useTheme();
	const [debounceFetch] = useDebounce(isFetching, 1500);
	const filterTypes = useMemo(() => renderFilterTypes, []);
	const defaultColumn = useMemo(() => ({ Filter: DefaultColumnFilter }), []);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		page: rowPage,
		prepareRow,
		gotoPage,
		setPageSize,
		state: { selectedRowIds },
		selectedFlatRows,
	} = useTable(
		{
			columns,
			data,
			defaultColumn,
			initialState,
			filterTypes,
		},
		useFilters,
		useSortBy,
		useSticky,
		(paginate || selection) && usePagination,
		selection && useRowSelect
	);

	useEffect(() => {
		if (selection) {
			const dataRows = selectedFlatRows.map((d) => d.original);
			setSelectedRows(dataRows);
		}
	}, [selectedRowIds, setSelectedRows, selection, selectedFlatRows]);

	const rowData = rowPage || rows;

	return (
		<>
			<Stack spacing={2}>
				<TableWrapper>
					<Table {...getTableProps()} size='small' stickyHeader>
						<TableHead>
							{headerGroups.map((headerGroup, i) => (
								<TableRow key={i} {...headerGroup.getHeaderGroupProps()}>
									{headerGroup.headers.map((column, index) => (
										<TableCell key={index} sx={{ position: 'sticky !important' }} {...column.getHeaderProps([{ className: column.className }])}>
											<Stack direction='row' spacing={1.15} alignItems='center' sx={{ display: 'inline-flex' }}>
												<HeaderSort column={column} sort={sorting} />
											</Stack>
										</TableCell>
									))}
								</TableRow>
							))}
						</TableHead>
						<TableBody {...getTableBodyProps()} {...(striped && { className: 'striped' })}>
							<>
								{filterable && (
									<>
										{headerGroups.map((group, i) => (
											<TableRow key={i} {...group.getHeaderGroupProps()}>
												{group.headers.map((column, index) => (
													<TableCell key={index} {...column.getHeaderProps([{ className: column.className }])}>
														{column.canFilter ? column.render('Filter') : null}
													</TableCell>
												))}
											</TableRow>
										))}
									</>
								)}
							</>

							<>
								{debounceFetch && (
									<>
										{headerGroups.map((group, i) => (
											<TableRow key={i} {...group.getHeaderGroupProps()}>
												{group.headers.map((column, index) => (
													<TableCell key={index} {...column.getHeaderProps([{ className: column.className }])}>
														<Skeleton animation='pulse' height={44} />
														<Skeleton animation='wave' height={44} />
														<Skeleton animation='pulse' height={44} />
														<Skeleton animation='wave' height={44} />
														<Skeleton animation='pulse' height={44} />
														<Skeleton animation='wave' height={44} />
														<Skeleton animation='pulse' height={44} />
														<Skeleton animation='wave' height={44} />
														<Skeleton animation='pulse' height={44} />
														<Skeleton animation='wave' height={44} />
													</TableCell>
												))}
											</TableRow>
										))}
									</>
								)}
							</>

							<>
								{!debounceFetch && (
									<>
										{[...rowData].map((row, i) => {
											prepareRow(row);
											return (
												<TableRow
													key={i}
													{...row.getRowProps()}
													sx={{
														bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit',
													}}
												>
													{row.cells.map((cell, i) => {
														let bgcolor = 'inherit';
														if (row.isSelected) bgcolor = alpha(theme.palette.primary.lighter, 0.35);

														return (
															<TableCell key={i} {...cell.getCellProps([{ className: cell.column.className }])} sx={{ bgcolor, whiteSpace: 'nowrap' }}>
																{cell.render('Cell')}
															</TableCell>
														);
													})}
												</TableRow>
											);
										})}
									</>
								)}
							</>
						</TableBody>
					</Table>
				</TableWrapper>

				{paginate && (
					<>
						<Divider style={{ marginTop: 0 }} />
						<Box sx={{ p: 2, pt: 0, pb: 2 }}>
							<TablePagination
								pagination={pagination}
								page={page}
								limit={limit}
								setPage={setPage}
								setLimit={setLimit}
								gotoPage={gotoPage}
								setPageSize={setPageSize}
								// rows={rows}
							/>
						</Box>
					</>
				)}
			</Stack>
		</>
	);
}

ReactTable.defaultProps = {
	data: [],
	columns: [],
	striped: false,
	sorting: true,
	paginate: false,
	selection: false,
	pagination: {},
	filterable: false,
};

ReactTable.propTypes = {
	initialState: PropTypes.object,
	data: PropTypes.array.isRequired,
	columns: PropTypes.array.isRequired,
	striped: PropTypes.bool,
	sorting: PropTypes.bool,
	selection: PropTypes.bool,
	paginate: PropTypes.bool,
	pagination: PropTypes.object,
	page: PropTypes.number,
	isFetching: PropTypes.bool,
	limit: PropTypes.number,
	setPage: PropTypes.func,
	setLimit: PropTypes.func,
	setSelectedRows: PropTypes.func,
	filterable: PropTypes.bool,
};
