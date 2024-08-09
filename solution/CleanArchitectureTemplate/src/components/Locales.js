import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import React from 'react';

// third-party
import { IntlProvider } from 'react-intl';

// project import
import useConfig from '../hooks/useConfig';

// load locales files
const loadLocaleData = (locale) => {
	switch (locale) {
		case 'fr':
			return import('../utils/locales/fr.json');
		case 'ro':
			return import('../utils/locales/ro.json');
		case 'zh':
			return import('../utils/locales/zh.json');
		case 'en':
		default:
			return import('../utils/locales/en.json');
	}
};

// ==============================|| LOCALIZATION ||============================== //

const Locales = ({ children }) => {
	const { i18n } = useConfig();

	const [messages, setMessages] = useState();

	useEffect(() => {
		loadLocaleData(i18n).then((d) => {
			setMessages(d.default);
		});
	}, [i18n]);

	return (
		<>
			{messages && (
				<IntlProvider locale={i18n} defaultLocale='en' messages={messages}>
					{children}
				</IntlProvider>
			)}
		</>
	);
};

Locales.propTypes = {
	children: PropTypes.node,
};

export default Locales;
