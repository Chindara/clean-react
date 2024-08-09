// ==============================|| OVERRIDES - INPUT BASE ||============================== //

export default function InputBase(theme) {
	return {
		MuiInputBase: {
			styleOverrides: {
				sizeSmall: {
					fontSize: '0.75rem',
				},
				input: {
					'&.Mui-disabled': {
						opacity: theme.palette.mode === 'dark' && 0.6,
						WebkitTextFillColor: theme.palette.mode === 'dark' && 'white',
					},
				},
			},
		},
	};
}
