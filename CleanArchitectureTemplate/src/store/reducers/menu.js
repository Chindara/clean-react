// third-party
import { createSlice } from '@reduxjs/toolkit';

// initial state
// const initialState = {
// 	openItem: [],
// 	openComponent: 'buttons',
// 	drawerOpen: false,
// 	componentDrawerOpen: true,
// 	clearItem: false,
// };

const initialState = {
	openItem: [],
	openComponent: 'buttons',
	selectedID: null,
	drawerOpen: false,
	componentDrawerOpen: true,
	menuDashboard: {},
	error: null,
	clearItem: false,
	officerView: false,
	purchaseBased: false,
	userFunctions: [],
	userType: 0,
	companyName: null,
	userCredentials: {},
};

// ==============================|| SLICE - MENU ||============================== //

const menu = createSlice({
	name: 'menu',
	initialState,
	reducers: {
		activeItem(state, action) {
			state.openItem = action.payload.openItem;
		},

		clearActiveItem(state, action) {
			state.clearItem = action.payload.clearItem;
		},

		activeID(state, action) {
			state.selectedID = action.payload;
		},

		activeComponent(state, action) {
			state.openComponent = action.payload.openComponent;
		},

		openDrawer(state, action) {
			state.drawerOpen = action.payload.drawerOpen;
		},

		openComponentDrawer(state, action) {
			state.componentDrawerOpen = action.payload.componentDrawerOpen;
		},

		getMenuSuccess(state, action) {
			state.menuDashboard = action.payload;
		},

		hasError(state, action) {
			state.error = action.payload;
		},

		changeOfficerView(state, action) {
			state.officerView = action.payload.officerView;
		},

		setPurchaseBased(state, action) {
			state.purchaseBased = action.payload.purchaseBased;
		},

		setUserFunctions(state, action) {
			state.userFunctions = action.payload.userFunctions;
		},

		setUserType(state, action) {
			state.userType = action.payload.userType;
		},

		setCompanyName(state, action) {
			state.companyName = action.payload.companyName;
		},

		setUserCredentials(state, action) {
			state.userCredentials = action.payload.userCredentials;
		},
	},
});

export default menu.reducer;

export const {
	activeItem,
	clearActiveItem,
	activeComponent,
	openDrawer,
	openComponentDrawer,
	activeID,
	changeOfficerView,
	setPurchaseBased,
	setUserFunctions,
	setUserType,
	setCompanyName,
	setUserCredentials,
} = menu.actions;
