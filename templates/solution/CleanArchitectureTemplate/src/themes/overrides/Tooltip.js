export default function Tooltip(theme) {
	return {
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					color: theme.palette.mode === 'dark' && 'black',
				},
			},
		},
	};
}
