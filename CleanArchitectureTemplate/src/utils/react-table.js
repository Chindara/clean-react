import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

// material-ui
import {
	FormControl,
	MenuItem,
	OutlinedInput,
	Select,
	Slider,
	Stack,
	TextField,
	Tooltip,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import { useAsyncDebounce } from 'react-table';
import { matchSorter } from 'match-sorter';
import { format } from 'date-fns';

// project import
import IconButton from 'components/@extended/IconButton';

// assets
import { CloseOutlined, LineOutlined, SearchOutlined } from '@ant-design/icons';

export function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter, ...other }) {
	const count = preGlobalFilteredRows.length;
	const [value, setValue] = useState(globalFilter);
	const onChange = useAsyncDebounce((value) => {
		setGlobalFilter(value || undefined);
	}, 200);

	return (
		<OutlinedInput
			value={value || ''}
			onChange={(e) => {
				setValue(e.target.value);
				onChange(e.target.value);
			}}
			placeholder={`Search ${count} records...`}
			id='start-adornment-email'
			startAdornment={<SearchOutlined />}
			{...other}
		/>
	);
}

GlobalFilter.propTypes = {
	preGlobalFilteredRows: PropTypes.array,
	globalFilter: PropTypes.string,
	setGlobalFilter: PropTypes.func,
};

export function DefaultColumnFilter({ column: { filterValue, Header, setFilter } }) {
	return (
		<TextField
			fullWidth
			value={filterValue || ''}
			onChange={(e) => {
				setFilter(e.target.value || undefined);
			}}
			placeholder={Header}
			size='small'
		/>
	);
}

DefaultColumnFilter.propTypes = {
	column: PropTypes.object,
};

export function DateColumnFilter({ column: { filterValue, Header, setFilter } }) {
	return (
		<FormControl fullWidth>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<DatePicker
					format='dd/MM/yyyy'
					value={filterValue && new Date(filterValue)}
					onChange={(newValue) => {
						let formatDateFn = undefined;
						try {
							formatDateFn = format(newValue, 'M/d/yyyy');
						} catch (error) {
							/* empty */
						}
						console.log(formatDateFn);
						setFilter(undefined);
					}}
					renderInput={(params) => <TextField name={Header} {...params} placeholder={`Select ${Header}`} />}
				/>
			</LocalizationProvider>
		</FormControl>
	);
}

DateColumnFilter.propTypes = {
	column: PropTypes.object,
};

export function SelectColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
	const options = useMemo(() => {
		const options = new Set();
		preFilteredRows.forEach((row) => {
			options.add(row.values[id]);
		});
		return [...options.values()];
	}, [id, preFilteredRows]);

	return (
		<Select
			value={filterValue ?? ''}
			onChange={(e) => {
				setFilter(e.target.value || undefined);
			}}
			displayEmpty
			size='small'
		>
			<MenuItem value=''>All</MenuItem>
			{options.map((option, i) => (
				<MenuItem key={i} value={option}>
					{option}
				</MenuItem>
			))}
		</Select>
	);
}

SelectColumnFilter.propTypes = {
	column: PropTypes.object,
};

export function SliderColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
	const [min, max] = useMemo(() => {
		let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
		let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
		preFilteredRows.forEach((row) => {
			min = Math.min(row.values[id], min);
			max = Math.max(row.values[id], max);
		});
		return [min, max];
	}, [id, preFilteredRows]);

	return (
		<Stack direction='row' alignItems='center' spacing={1} sx={{ pl: 1, minWidth: 120 }}>
			<Slider
				value={filterValue || min}
				min={min}
				max={max}
				step={1}
				onChange={(event, newValue) => {
					setFilter(newValue);
				}}
				valueLabelDisplay='auto'
				aria-labelledby='non-linear-slider'
			/>
			<Tooltip title='Reset'>
				<IconButton size='small' color='error' onClick={() => setFilter(undefined)}>
					<CloseOutlined />
				</IconButton>
			</Tooltip>
		</Stack>
	);
}

SliderColumnFilter.propTypes = {
	column: PropTypes.object,
};

export function NumberRangeColumnFilter({ column: { filterValue = [], preFilteredRows, setFilter, id } }) {
	const [min, max] = useMemo(() => {
		let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
		let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
		preFilteredRows.forEach((row) => {
			min = Math.min(row.values[id], min);
			max = Math.max(row.values[id], max);
		});
		return [min, max];
	}, [id, preFilteredRows]);

	return (
		<Stack direction='row' alignItems='center' spacing={1} sx={{ minWidth: 168, maxWidth: 250 }}>
			<TextField
				fullWidth
				value={filterValue[0] || ''}
				type='number'
				onChange={(e) => {
					const val = e.target.value;
					setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]]);
				}}
				placeholder={`Min (${min})`}
				size='small'
			/>
			<LineOutlined />
			<TextField
				fullWidth
				value={filterValue[1] || ''}
				type='number'
				onChange={(e) => {
					const val = e.target.value;
					setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined]);
				}}
				placeholder={`Max (${max})`}
				size='small'
			/>
		</Stack>
	);
}

NumberRangeColumnFilter.propTypes = {
	column: PropTypes.object,
};

function fuzzyTextFilterFn(rows, id, filterValue) {
	return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

fuzzyTextFilterFn.autoRemove = (val) => !val;

export const renderFilterTypes = () => ({
	fuzzyText: fuzzyTextFilterFn,
	text: (rows, id, filterValue) => {
		rows.filter((row) => {
			const rowValue = row.values[id];
			return rowValue !== undefined
				? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
				: true;
		});
	},
});

export function filterGreaterThan(rows, id, filterValue) {
	return rows.filter((row) => {
		const rowValue = row.values[id];
		return rowValue >= filterValue;
	});
}

filterGreaterThan.autoRemove = (val) => typeof val !== 'number';

export function useControlledState(state) {
	return useMemo(() => {
		if (state.groupBy.length) {
			return {
				...state,
				hiddenColumns: [...state.hiddenColumns, ...state.groupBy].filter((d, i, all) => all.indexOf(d) === i),
			};
		}
		return state;
	}, [state]);
}

export function roundedMedian(leafValues) {
	let min = leafValues[0] || 0;
	let max = leafValues[0] || 0;

	leafValues.forEach((value) => {
		min = Math.min(min, value);
		max = Math.max(max, value);
	});

	return Math.round((min + max) / 2);
}
