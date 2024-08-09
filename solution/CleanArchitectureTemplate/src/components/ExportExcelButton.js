import React from 'react';
import { saveAs } from 'file-saver';
import { IconButton, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';
import moment from 'moment';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const ExportExcelButton = ({ title, filename, headers, data }) => {
	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.sheet_add_aoa(worksheet, [headers]);
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

		// Buffer to store the generated Excel file
		const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

		const timeStamp = moment().format('yyyyMMDDHHmm');
		console.log(timeStamp);
		const filenameWithExtension = filename + '_' + timeStamp + '.xlsx';

		saveAs(blob, filenameWithExtension);
	};

	return (
		<>
			<Tooltip title={title}>
				<IconButton aria-label='fingerprint' color='primary' onClick={(e) => exportToExcel(filename)}>
					<FileDownloadOutlinedIcon />
				</IconButton>
			</Tooltip>
		</>
	);
};

ExportExcelButton.propTypes = {
	title: PropTypes.string,
	filename: PropTypes.string,
	headers: PropTypes.array,
	data: PropTypes.array,
};

export default ExportExcelButton;
