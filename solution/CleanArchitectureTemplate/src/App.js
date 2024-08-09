// PROJECT IMPORT
import Routes from 'routes';
import ThemeCustomization from 'themes';
import Locales from 'components/Locales';
import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
// import './App.css';

import { JWTProvider as AuthProvider } from 'contexts/JWTContext';

// THIRD-PARTY
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';

// TOASTIFY
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeCustomization>
				<RTLLayout>
					<Locales>
						<ScrollTop>
							<AuthProvider>
								<>
									<Routes />
									<Snackbar />
									<ToastContainer
										autoClose={3000}
										hideProgressBar={false}
										newestOnTop
										closeOnClick
										rtl={false}
										pauseOnFocusLoss
										draggable
										pauseOnHover
										theme='colored'
										style={{ fontSize: '14px' }}
									/>
								</>
							</AuthProvider>
						</ScrollTop>
					</Locales>
				</RTLLayout>
			</ThemeCustomization>
		</QueryClientProvider>
	);
}

export default App;
