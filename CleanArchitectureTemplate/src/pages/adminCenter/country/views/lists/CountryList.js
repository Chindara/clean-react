import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

// MUI
import { useTheme } from '@mui/material/styles';
import { Link, Chip } from '@mui/material';

// THIRD-PARTY
import { useQuery } from '@tanstack/react-query';

// PROJECT IMPORT
import ReactTable from 'components/ui/ReactTable';
import SimpleBar from 'components/third-party/SimpleBar';
import CountryKebabMenu from '../../components/CountryKebabMenu';

// SERVICES
import CountryService from 'services/CountryService';

// CONSTANTS
import { PAGINATION_PROPERTIES, STATUS_PROPERTIES_TABLE } from 'constants/Common';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| COMPANY LIST ||============================== //\

export default function CountryList({ handleCountryForm }) {
	const theme = useTheme();
	const { companyId } = useAuth();
	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);

	const {
		data: { countries, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['country', { page, limit }],
		queryFn: () => getCountries(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { countries: [], pagination: {} },
	});

	const getCountries = async () => {
		const { data: { items = [], ...pagination } = {} } = await CountryService.getAll(companyId, page, limit);
		return { countries: items, pagination: pagination };
	};

	const columns = useMemo(
		() => [
			{
				Header: 'Name',
				accessor: 'name',
				Cell: ({ row, value }) => (
					<Link
						underline='hover'
						color={theme.palette.mode === 'dark' ? '#FFFFFF' : '#262626'}
						onClick={() => handleCountryForm(OPERATION_MODE.View, row?.original?.id)}
						sx={{ cursor: 'pointer' }}
					>
						{value}
					</Link>
				),
			},
			{
				id: 'actions-column',
				className: 'cell-center',
				disableSortBy: true,
				Cell: ({ row }) => {
					return <CountryKebabMenu row={row} handleClick={handleCountryForm} />;
				},
			},
			{
				Header: 'Status',
				accessor: 'status',
				Cell: ({ value }) => (
					<Chip
						label={value}
						size='small'
						variant='light'
						color={STATUS_PROPERTIES_TABLE[value] ?? 'default'}
					/>
				),
			},
		],
		[theme, handleCountryForm]
	);

	return (
		<>
			<SimpleBar>
				<ReactTable
					data={countries}
					columns={columns}
					paginate={true}
					pagination={pagination}
					page={page}
					limit={limit}
					setPage={setPage}
					setLimit={setLimit}
					isFetching={isFetching}
				/>
			</SimpleBar>
		</>
	);
}

CountryList.propTypes = {
	handleCountryForm: PropTypes.func.isRequired,
	row: PropTypes.shape({
		original: PropTypes.shape({
			id: PropTypes.any,
		}),
	}),
	value: PropTypes.any,
};
