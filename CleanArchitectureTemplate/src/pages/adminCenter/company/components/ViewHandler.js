import React from 'react';
import PropTypes from 'prop-types';

import Company from '../views/features/Company';
import { OPERATION_MODE } from 'constants/Types';
import AssignUsers from '../views/features/AssignUsers';

export default function ViewHandler({ openPanel, setOpenPanel, openDeleteModal, setOpenDeleteModal, selectedCompany, setSelectedCompany }) {
	return (
		<>
			{(selectedCompany.mode === OPERATION_MODE.Create || selectedCompany.mode === OPERATION_MODE.Edit || selectedCompany.mode === OPERATION_MODE.View||selectedCompany.mode === OPERATION_MODE.Delete) && (
				<Company
					openPanel={openPanel}
					setOpenPanel={setOpenPanel}
					openDeleteModal={openDeleteModal}
					setOpenDeleteModal={setOpenDeleteModal}
					selectedCompany={selectedCompany}
					setSelectedCompany={setSelectedCompany}
				/>
			)}

			{selectedCompany.mode === OPERATION_MODE.AssignUser && (
				<AssignUsers openPanel={openPanel} setOpenPanel={setOpenPanel} selectedCompany={selectedCompany} setSelectedCompany={setSelectedCompany} />
			)}
		</>
	);
}

ViewHandler.propTypes = {
	openPanel: PropTypes.bool,
	setOpenPanel: PropTypes.func,
	openDeleteModal: PropTypes.bool,
	setOpenDeleteModal: PropTypes.func,
	selectedCompany: PropTypes.object,
	setSelectedCompany: PropTypes.func,
};
