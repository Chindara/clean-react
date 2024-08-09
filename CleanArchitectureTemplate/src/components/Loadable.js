import React, { Suspense } from 'react';

// PROJECT IMPORT
import Loader from './Loader';
import ErrorBoundary from './ErrorBoundary';

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

const Loadable = (Component) => (props) =>
	(
		<Suspense fallback={<Loader />}>
			<ErrorBoundary>
				<Component {...props} />
			</ErrorBoundary>
		</Suspense>
	);

export default Loadable;
