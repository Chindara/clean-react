import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

// MUI
import { useTheme } from '@mui/material/styles';
import { Link, Chip, FormGroup, FormControlLabel } from '@mui/material';

// THIRD-PARTY
import { useQuery, useQueryClient } from '@tanstack/react-query';

// PROJECT IMPORT
import ReactTable from 'components/ui/ReactTable';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import CompanyKebabMenu from 'pages/adminCenter/company/components/menu/CompanyKebabMenu';

// SERVICES
import CompanyService from 'services/CompanyService';

// CONSTANTS
import { PAGINATION_PROPERTIES, STATUS_PROPERTIES_TABLE } from 'constants/Common';
import { OPERATION_MODE } from 'constants/Types';
import useAuth from 'hooks/useAuth';
import IOSSwitch from 'components/IOSSwitch';

// ==============================|| COMPANY LIST ||============================== //\

export default function CompanyList({ handleCompanyForm }) {
	const theme = useTheme();
	const { companyId } = useAuth();
	const queryClient = useQueryClient();
	const [page, setPage] = useState(PAGINATION_PROPERTIES.Page);
	const [limit, setLimit] = useState(PAGINATION_PROPERTIES.Limit);

	const {
		data: { companies, pagination },
		isFetching,
	} = useQuery({
		queryKey: ['company', { page, limit }],
		queryFn: () => getCompanies(),
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		initialData: { companies: [], pagination: {} },
	});

	const getCompanies = async () => {
		const { data: { items = [], ...pagination } = {} } = await CompanyService.getAll(companyId, page, limit);
		return { companies: items, pagination: pagination };
	};

    const handleToggleChange = async (companyId, isPurchaseBased) => {
        // Update the state locally
        queryClient.setQueryData(['company', { page, limit }], (oldData) => {
            const newCompanies = oldData.companies.map((company) =>
                company.id === companyId
                    ? { ...company, isPurchaseBased: !isPurchaseBased }
                    : company
            );
            return { ...oldData, companies: newCompanies };
        });

        // Make an API call here to save the change to the backend
        await CompanyService.updateCompany(companyId, { isPurchaseBased: !isPurchaseBased });
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
						onClick={() => handleCompanyForm(OPERATION_MODE.View, row?.original?.id)}
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
					return <CompanyKebabMenu row={row} handleClick={handleCompanyForm} />;
				},
			},
			{
				Header: 'Address',
				accessor: 'address',
			},
			{
				Header: 'VAT No',
				accessor: 'vatNo',
			},
			{
				Header: 'BR No',
				accessor: 'brNo',
			},
			{
				Header: 'Purchase Based',
				accessor: 'isPurchaseBased',
				Cell: ({ row }) => (
					<IOSSwitch
						checked={row.original.isPurchaseBased}
						//onChange={() => handleToggleChange(row.original.id)}
					/>
				),
			},
			{
				Header: 'Status',
				accessor: 'status',
				Cell: ({ value }) => <Chip label={value} size='small' variant='light' color={STATUS_PROPERTIES_TABLE[value] ?? 'default'} />,
			},
		],
		[theme, handleCompanyForm]
	);

	return (
		<>
			<ScrollX>
				<ReactTable
					data={companies}
					columns={columns}
					paginate={true}
					pagination={pagination}
					page={page}
					limit={limit}
					setPage={setPage}
					setLimit={setLimit}
					isFetching={isFetching}
				/>
			</ScrollX>
		</>
	);
}

CompanyList.propTypes = {
	handleCompanyForm: PropTypes.func.isRequired,
	row: PropTypes.shape({
		original: PropTypes.shape({
			id: PropTypes.any,
			isPurchaseBased: PropTypes.bool.isRequired,
		}),
	}),
	value: PropTypes.any,
};
