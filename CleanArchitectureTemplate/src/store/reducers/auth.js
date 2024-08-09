// action - state management
import { LOGGED_STATE } from 'common/state/logged-state';
import { REGISTER, LOGIN, LOGOUT, CHANGE_COMPANY, RESET } from './actions';

// initial state
// export const initialState = {
// 	isLoggedIn: false,
// 	isInitialized: false,
// 	user: null,
// };

// ==============================|| AUTH REDUCER ||============================== //

const auth = (state = LOGGED_STATE, action) => {
	switch (action.type) {
		case CHANGE_COMPANY: {
			return {
				...state,
				companyId: action.payload.companyId,
			};
		}

		case LOGIN: {
			return {
				...state,
				...action.payload,
				isInitialized: true,
			};
		}
		case LOGOUT: {
			return {
				...state,
				isLogin: false,
				isInitialized: true,
			};
		}
		case RESET: {
			return {
				...state,
				isLogin: false,
				isInitialized: true,
			};
		}
		default: {
			return { ...state };
		}
	}
};

export default auth;
