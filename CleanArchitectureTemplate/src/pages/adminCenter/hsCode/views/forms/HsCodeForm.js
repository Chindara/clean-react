import React, { useId } from 'react';
import PropTypes from 'prop-types';

// MUI
import { Grid, TextField, InputLabel, Stack, Box, Skeleton, FormControl, MenuItem, Select } from '@mui/material';

// CONTEXTS
import { useHsCode } from 'pages/adminCenter/hsCode/contexts/HsCodeContext';

// CONSTANTS
import { OPERATION_MODE } from 'constants/Types';
import { HS_CODE_ERROR } from 'constants/ValidationMessage';
import { CONTROL_SIZE } from 'constants/Common';
import MainCard from 'components/MainCard';
import Typography from 'themes/overrides/Typography';
import { fontWeight } from '@mui/system';
import useAuth from 'hooks/useAuth';

// ==============================|| HS CODE FORM ||============================== //

export default function HsCodeForm({ isFetching }) {
	const { userId, companyId } = useAuth();
	console.log(userId, companyId)

	const id = useId();
	const { hsCode, setHsCode, error, setError, mode } = useHsCode();

	const handleHsCode = (event) => {
		const { name, value } = event.target;

		let errorList = error;
		if (name) {
			let errorIndex = errorList.indexOf(`validate-${name}`);
			if (errorIndex !== -1) errorList.splice(errorIndex, 1);
			setError(errorList);
		}

		setHsCode({ ...hsCode, [name]: value });
	};

	return (
		<>
			{isFetching ? (
				<Box px={1} mt={1}>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<Skeleton animation='wave' variant='rounded' width='100%' height={30} />
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<Skeleton animation='wave' variant='rounded' width='100%' height={30} />
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<Skeleton animation='wave' variant='rounded' width='100%' height={30} />
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={0.5}>
								<Skeleton animation='wave' variant='rounded' width='100%' height={30} />
							</Stack>
						</Grid>
					</Grid>
				</Box>
			) : (
				<MainCard>
					<Grid container spacing={1} justifyContent='flex-start'>
						<Grid item xs={6}>
							<Stack spacing={0.5}>
								<InputLabel required>HS Code</InputLabel>
								<TextField
									id={`code-${id}`}
									name='code'
									size={CONTROL_SIZE}
									value={hsCode.code}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter HS Code'
									fullWidth
									error={error.includes('validate-code')}
									helperText={error.includes('validate-code') && HS_CODE_ERROR.codeRequired}
									onChange={handleHsCode}
								/>
							</Stack>
						</Grid>
						<Grid item xs={6}>
							<Stack spacing={0.5}>
								<InputLabel required>Description</InputLabel>
								<TextField
									id={`description-${id}`}
									name='description'
									size={CONTROL_SIZE}
									value={hsCode.description}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter Description'
									fullWidth
									error={error.includes('validate-description')}
									helperText={error.includes('validate-description') && HS_CODE_ERROR.descriptionRequired}
									onChange={handleHsCode}
								/>
							</Stack>
						</Grid>
						<Grid item xs={6}>
							<Stack spacing={0.5}>
								<InputLabel >Unit</InputLabel>
								<TextField
									id={`unit-${id}`}
									name='unit'
									size={CONTROL_SIZE}
									value={hsCode.unit}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter Unit'
									fullWidth
									// error={error.includes('validate-unit')}
									// helperText={error.includes('validate-unit') && HS_CODE_ERROR.unitRequired}
									onChange={handleHsCode}
								/>
							</Stack>
						</Grid>
						<Grid item xs={6}>
							<Stack spacing={0.5}>
								<InputLabel >ICL/SLSI</InputLabel>
								<TextField
									id={`iclslsi-${id}`}
									name='iclslsi'
									size={CONTROL_SIZE}
									value={hsCode.iclslsi}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter ICL/SLSI'
									fullWidth
									// error={error.includes('validate-iclslsi')}
									// helperText={error.includes('validate-iclslsi') && HS_CODE_ERROR.iclslsiRequired}
									onChange={handleHsCode}
								/>
							</Stack>
						</Grid>

						<Grid item xs={12}>
							<Grid item xs={12}>
								<InputLabel>Preferential Duty</InputLabel>
							</Grid>
							<Box border={1} borderColor='grey.400' p={2} borderRadius={1}>
								<Grid container spacing={1}>
									<Grid item xs={6}>
										<Stack spacing={0.5}>
											<InputLabel >AP</InputLabel>
											<TextField
												id={`preferentialAP-${id}`}
												name='preferentialAP'
												size={CONTROL_SIZE}
												value={hsCode.preferentialAP}
												disabled={mode === OPERATION_MODE.View}
												placeholder='Enter AP'
												fullWidth
												// error={error.includes('validate-preferentialAP')}
												// helperText={error.includes('validate-preferentialAP') && HS_CODE_ERROR.apRequired}
												onChange={handleHsCode}
											/>
										</Stack>
									</Grid>
									<Grid item xs={6}>
										<Stack spacing={0.5}>
											<InputLabel >AD</InputLabel>
											<TextField
												id={`preferentialAD-${id}`}
												name='preferentialAD'
												size={CONTROL_SIZE}
												value={hsCode.preferentialAD}
												disabled={mode === OPERATION_MODE.View}
												placeholder='Enter AD'
												fullWidth
												// error={error.includes('validate-preferentialAD')}
												// helperText={error.includes('validate-preferentialAD') && HS_CODE_ERROR.adRequired}
												onChange={handleHsCode}
											/>
										</Stack>
									</Grid>
									<Grid item xs={6}>
										<Stack spacing={0.5}>
											<InputLabel >BN</InputLabel>
											<TextField
												id={`preferentialBN-${id}`}
												name='preferentialBN'
												size={CONTROL_SIZE}
												value={hsCode.preferentialBN}
												disabled={mode === OPERATION_MODE.View}
												placeholder='Enter BN'
												fullWidth
												// error={error.includes('validate-preferentialBN')}
												// helperText={error.includes('validate-preferentialBN') && HS_CODE_ERROR.bnRequired}
												onChange={handleHsCode}
											/>
										</Stack>
									</Grid>
									<Grid item xs={6}>
										<Stack spacing={0.5}>
											<InputLabel >GT</InputLabel>
											<TextField
												id={`preferentialGT-${id}`}
												name='preferentialGT'
												size={CONTROL_SIZE}
												value={hsCode.preferentialGT}
												disabled={mode === OPERATION_MODE.View}
												placeholder='Enter GT'
												fullWidth
												// error={error.includes('validate-preferentialGT')}
												// helperText={error.includes('validate-preferentialGT') && HS_CODE_ERROR.gtRequired}
												onChange={handleHsCode}
											/>
										</Stack>
									</Grid>
									<Grid item xs={6}>
										<Stack spacing={0.5}>
											<InputLabel >IN</InputLabel>
											<TextField
												id={`preferentialIN-${id}`}
												name='preferentialIN'
												size={CONTROL_SIZE}
												value={hsCode.preferentialIN}
												disabled={mode === OPERATION_MODE.View}
												placeholder='Enter IN'
												fullWidth
												// error={error.includes('validate-preferentialIN')}
												// helperText={error.includes('validate-preferentialIN') && HS_CODE_ERROR.inRequired}
												onChange={handleHsCode}
											/>
										</Stack>
									</Grid>
									<Grid item xs={6}>
										<Stack spacing={0.5}>
											<InputLabel >PK</InputLabel>
											<TextField
												id={`preferentialPK-${id}`}
												name='preferentialPK'
												size={CONTROL_SIZE}
												value={hsCode.preferentialPK}
												disabled={mode === OPERATION_MODE.View}
												placeholder='Enter PK'
												fullWidth
												// error={error.includes('validate-preferentialPK')}
												// helperText={error.includes('validate-preferentialPK') && HS_CODE_ERROR.pkRequired}
												onChange={handleHsCode}
											/>
										</Stack>
									</Grid>
									<Grid item xs={6}>
										<Stack spacing={0.5}>
											<InputLabel >SA</InputLabel>
											<TextField
												id={`preferentialSA-${id}`}
												name='preferentialSA'
												size={CONTROL_SIZE}
												value={hsCode.preferentialSA}
												disabled={mode === OPERATION_MODE.View}
												placeholder='Enter SA'
												fullWidth
												// error={error.includes('validate-preferentialSA')}
												// helperText={error.includes('validate-preferentialSA') && HS_CODE_ERROR.saRequired}
												onChange={handleHsCode}
											/>
										</Stack>
									</Grid>
									<Grid item xs={6}>
										<Stack spacing={0.5}>
											<InputLabel >SF</InputLabel>
											<TextField
												id={`preferentialSF-${id}`}
												name='preferentialSF'
												size={CONTROL_SIZE}
												value={hsCode.preferentialSF}
												disabled={mode === OPERATION_MODE.View}
												placeholder='Enter SF'
												fullWidth
												// error={error.includes('validate-preferentialSF')}
												// helperText={error.includes('validate-preferentialSF') && HS_CODE_ERROR.sfRequired}
												onChange={handleHsCode}
											/>
										</Stack>
									</Grid>
									<Grid item xs={6}>
										<Stack spacing={0.5}>
											<InputLabel >SD</InputLabel>
											<TextField
												id={`preferentialSD-${id}`}
												name='preferentialSD'
												size={CONTROL_SIZE}
												value={hsCode.preferentialSD}
												disabled={mode === OPERATION_MODE.View}
												placeholder='Enter SD'
												fullWidth
												// error={error.includes('validate-preferentialSD')}
												// helperText={error.includes('validate-preferentialSD') && HS_CODE_ERROR.sdRequired}
												onChange={handleHsCode}
											/>
										</Stack>
									</Grid>
									<Grid item xs={6}>
										<Stack spacing={0.5}>
											<InputLabel >SG</InputLabel>
											<TextField
												id={`preferentialSG-${id}`}
												name='preferentialSG'
												size={CONTROL_SIZE}
												value={hsCode.preferentialSG}
												disabled={mode === OPERATION_MODE.View}
												placeholder='Enter SG'
												fullWidth
												// error={error.includes('validate-preferentialSG')}
												// helperText={error.includes('validate-preferentialSG') && HS_CODE_ERROR.sgRequired}
												onChange={handleHsCode}
											/>
										</Stack>
									</Grid>
								</Grid>
							</Box>
						</Grid>

						<Grid item xs={6}>
							<Stack spacing={0.5}>
								<InputLabel >Gen Duty</InputLabel>
								<TextField
									id={`genDuty-${id}`}
									name='genDuty'
									size={CONTROL_SIZE}
									value={hsCode.genDuty}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter Gen Duty'
									fullWidth
									// error={error.includes('validate-genDuty')}
									// helperText={error.includes('validate-genDuty') && HS_CODE_ERROR.genDutyRequired}
									onChange={handleHsCode}
								/>
							</Stack>
						</Grid>
						<Grid item xs={6}>
							<Stack spacing={0.5}>
								<InputLabel >VAT</InputLabel>
								<TextField
									id={`vat-${id}`}
									name='vat'
									size={CONTROL_SIZE}
									value={hsCode.vat}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter Vat'
									fullWidth
									// error={error.includes('validate-vat')}
									// helperText={error.includes('validate-vat') && HS_CODE_ERROR.vatRequired}
									onChange={handleHsCode}
								/>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Grid item xs={12}>
								<InputLabel>PAL</InputLabel>
							</Grid>
							<Box border={1} borderColor='grey.400' borderRadius={2} p={2} width='100%'>
								<Grid container spacing={2}>
									<Grid item xs={6}>
										<Stack spacing={0.5}>
											<InputLabel >Gen</InputLabel>
											<TextField
												id={`palGen-${id}`}
												name='palGen'
												size={CONTROL_SIZE}
												value={hsCode.palGen}
												disabled={mode === OPERATION_MODE.View}
												placeholder='Enter Gen'
												fullWidth
												// error={error.includes('validate-palGen')}
												// helperText={error.includes('validate-palGen') && HS_CODE_ERROR.genRequired}
												onChange={handleHsCode}
											/>
										</Stack>
									</Grid>
									<Grid item xs={6}>
										<Stack spacing={0.5}>
											<InputLabel >SG</InputLabel>
											<TextField
												id={`palsg-${id}`}
												name='palsg'
												size={CONTROL_SIZE}
												value={hsCode.palsg}
												disabled={mode === OPERATION_MODE.View}
												placeholder='Enter Name'
												fullWidth
												// error={error.includes('validate-palsg')}
												// helperText={error.includes('validate-palsg') && HS_CODE_ERROR.sgRequired}
												onChange={handleHsCode}
											/>
										</Stack>
									</Grid>
								</Grid>
							</Box>
						</Grid>
						<Grid item xs={12}>
							<Grid item xs={12}>
								<InputLabel>CESS</InputLabel>
							</Grid>
							<Box border={1} borderColor='grey.400' borderRadius={2} p={2} width='100%'>
								<Grid container spacing={2}>
									<Grid item xs={6}>
										<Stack spacing={0.5}>
											<InputLabel >Gen</InputLabel>
											<TextField
												id={`cessGen-${id}`}
												name='cessGen'
												size={CONTROL_SIZE}
												value={hsCode.cessGen}
												disabled={mode === OPERATION_MODE.View}
												placeholder='Enter Gen'
												fullWidth
												// error={error.includes('validate-cessGen')}
												// helperText={error.includes('validate-cessGen') && HS_CODE_ERROR.genRequired}
												onChange={handleHsCode}
											/>
										</Stack>
									</Grid>
									<Grid item xs={6}>
										<Stack spacing={0.5}>
											<InputLabel >SG</InputLabel>
											<TextField
												id={`cessSG-${id}`}
												name='cessSG'
												size={CONTROL_SIZE}
												value={hsCode.cessSG}
												disabled={mode === OPERATION_MODE.View}
												placeholder='Enter Name'
												fullWidth
												// error={error.includes('validate-cessSG')}
												// helperText={error.includes('validate-cessSG') && HS_CODE_ERROR.sgRequired}
												onChange={handleHsCode}
											/>
										</Stack>
									</Grid>
								</Grid>
							</Box>
						</Grid>
						<Grid item xs={6}>
							<Stack spacing={0.5}>
								<InputLabel >Surcharge on Customs Duty</InputLabel>
								<TextField
									id={`surchargeOnCustomsDuty-${id}`}
									name='surchargeOnCustomsDuty'
									size={CONTROL_SIZE}
									value={hsCode.surchargeOnCustomsDuty}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter Surcharge'
									fullWidth
									// error={error.includes('validate-surchargeOnCustomsDuty')}
									// helperText={error.includes('validate-surchargeOnCustomsDuty') && HS_CODE_ERROR.surchargeRequired}
									onChange={handleHsCode}
								/>
							</Stack>
						</Grid>
						<Grid item xs={6}>
							<Stack spacing={0.5}>
								<InputLabel >Excise(S.P.D)</InputLabel>
								<TextField
									id={`excise-${id}`}
									name='excise'
									size={CONTROL_SIZE}
									value={hsCode.excise}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter Excise'
									fullWidth
									// error={error.includes('validate-excise')}
									// helperText={error.includes('validate-excise') && HS_CODE_ERROR.exciseRequired}
									onChange={handleHsCode}
								/>
							</Stack>
						</Grid>
						<Grid item xs={6}>
							<Stack spacing={0.5}>
								<InputLabel >SSCL</InputLabel>
								<TextField
									id={`sscl-${id}`}
									name='sscl'
									size={CONTROL_SIZE}
									value={hsCode.sscl}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter SSCL'
									fullWidth
									// error={error.includes('validate-sscl')}
									// helperText={error.includes('validate-sscl') && HS_CODE_ERROR.ssclRequired}
									onChange={handleHsCode}
								/>
							</Stack>
						</Grid>
						<Grid item xs={6}>
							<Stack spacing={0.5}>
								<InputLabel >SCL</InputLabel>
								<TextField
									id={`scl-${id}`}
									name='scl'
									size={CONTROL_SIZE}
									value={hsCode.scl}
									disabled={mode === OPERATION_MODE.View}
									placeholder='Enter SCL'
									fullWidth
									// error={error.includes('validate-scl')}
									// helperText={error.includes('validate-scl') && HS_CODE_ERROR.sclRequired}
									onChange={handleHsCode}
								/>
							</Stack>
						</Grid>
					</Grid>
				</MainCard>
			)}
		</>
	);
}

HsCodeForm.propTypes = {
	isFetching: PropTypes.bool,
};
