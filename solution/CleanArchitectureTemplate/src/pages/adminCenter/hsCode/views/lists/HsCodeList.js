import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

// MUI
import { useTheme } from '@mui/material/styles';
import { Link, Chip } from '@mui/material';

// THIRD-PARTY
import { useQuery } from '@tanstack/react-query';

// PROJECT IMPORT
import ReactTable from 'components/ui/ReactTable';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import HsCodeKebabMenu from '../../components/HsCodeKebabMenu';

// SERVICES
import HsCodeService from 'services/HsCodeService';

// CONSTANTS
import { PAGINATION_PROPERTIES, STATUS_PROPERTIES_TABLE } from 'constants/Common';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';

// ==============================|| COMPANY LIST ||============================== //\

export default function HsCodeList({ handleHsCodeForm }) {
	const theme = useTheme();
    const { companyId } = useAuth();
	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);

	const {
		data: { hsCodes, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['hsCode', { page, limit }],
		queryFn: () => getHsCodes(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { hsCodes: [], pagination: {} },
	});

	const getHsCodes = async () => {
		const { data: { items = [], ...pagination } = {} } = await HsCodeService.getAll(companyId, page, limit);
		return { hsCodes: items, pagination: pagination };
	};

	const columns = useMemo(
		() => [
			{
				Header: 'HSCode',
				accessor: 'code',
				Cell: ({ row, value }) => (
					<Link
						underline='hover'
						color={theme.palette.mode === 'dark' ? '#FFFFFF' : '#262626'}
						onClick={() => handleHsCodeForm(OPERATION_MODE.View, row?.original?.id)}
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
					return <HsCodeKebabMenu row={row} handleClick={handleHsCodeForm} />;
				},
			},
			{
				Header: 'Description',
				accessor: 'description',
			},
			{
				Header: 'unit',
				accessor: 'unit',
			},
			{
				Header: 'iclslsi',
				accessor: 'iclslsi',
			},
			{
				Header: 'preferentialAP',
				accessor: 'preferentialAP',
			},
			{
				Header: 'preferentialAD',
				accessor: 'preferentialAD',
			},
			{
				Header: 'preferentialBN',
				accessor: 'preferentialBN',
			},
			{
				Header: 'preferentialGT',
				accessor: 'preferentialGT',
			},
			{
				Header: 'ipreferentialINn',
				accessor: 'preferentialIN',
			},
			{
				Header: 'preferentialPK',
				accessor: 'preferentialPK',
			},
			{
				Header: 'preferentialSA',
				accessor: 'preferentialSA',
			},
			{
				Header: 'preferentialSF',
				accessor: 'preferentialSF',
			},
			{
				Header: 'preferentialSD',
				accessor: 'preferentialSD',
			},
			{
				Header: 'preferentialSG',
				accessor: 'preferentialSG',
			},
			{
				Header: 'genDuty',
				accessor: 'genDuty',
			},
			{
				Header: 'vat',
				accessor: 'vat',
			},
			{
				Header: 'palGen',
				accessor: 'palGen',
			},
			{
				Header: 'palSG',
				accessor: 'palsg',
			},
			{
				Header: 'cessGen',
				accessor: 'cessGen',
			},
			{
				Header: 'cessSG',
				accessor: 'cessSG',
			},
			{
				Header: 'Surcharge',
				accessor: 'surchargeOnCustomsDuty',
			},
			{
				Header: 'excise',
				accessor: 'excise',
			},
			{
				Header: 'sscl',
				accessor: 'sscl',
			},
			{
				Header: 'scl',
				accessor: 'scl',
			},
		],
		[theme, handleHsCodeForm]
	);

	return (
		<>
				<SimpleBar>
					<ReactTable
						data={hsCodes}
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
HsCodeList.propTypes = {
	handleHsCodeForm: PropTypes.func.isRequired,
	row: PropTypes.shape({
		original: PropTypes.shape({
			id: PropTypes.any,
		}),
	}),
	value: PropTypes.any,
};
