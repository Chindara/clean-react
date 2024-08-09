import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

const AuthBackground = () => {
	const theme = useTheme();

	return <>{/* <img src={background} /> */}</>;
	// return (
	// 	<Box sx={{ position: 'absolute', filter: 'blur(18px)', zIndex: -1, bottom: 0 }}>
	// 		{/* <svg width='100%' height='calc(100vh - 175px)' viewBox='0 0 405 809' fill='none' xmlns='http://www.w3.org/2000/svg'>
	// 			<path
	// 				d='M-358.39 358.707L-293.914 294.23L-293.846 294.163H-172.545L-220.81 342.428L-233.272 354.889L-282.697 404.314L-276.575 410.453L0.316589 687.328L283.33 404.314L233.888 354.889L230.407 351.391L173.178 294.163H294.48L294.547 294.23L345.082 344.765L404.631 404.314L0.316589 808.629L-403.998 404.314L-358.39 358.707ZM0.316589 0L233.938 233.622H112.637L0.316589 121.301L-112.004 233.622H-233.305L0.316589 0Z'
	// 				fill={theme.palette.primary.light}
	// 			/>
	// 			<path
	// 				d='M-516.39 358.707L-451.914 294.23L-451.846 294.163H-330.545L-378.81 342.428L-391.272 354.889L-440.697 404.314L-434.575 410.453L-157.683 687.328L125.33 404.314L75.8879 354.889L72.4068 351.391L15.1785 294.163H136.48L136.547 294.23L187.082 344.765L246.631 404.314L-157.683 808.629L-561.998 404.314L-516.39 358.707ZM-157.683 0L75.9383 233.622H-45.3627L-157.683 121.301L-270.004 233.622H-391.305L-157.683 0Z'
	// 				fill={theme.palette.success.light}
	// 				opacity='0.6'
	// 			/>
	// 			<path
	// 				d='M-647.386 358.707L-582.91 294.23L-582.842 294.163H-461.541L-509.806 342.428L-522.268 354.889L-571.693 404.314L-565.571 410.453L-288.68 687.328L-5.66624 404.314L-55.1082 354.889L-58.5893 351.391L-115.818 294.163H5.48342L5.5507 294.23L56.0858 344.765L115.635 404.314L-288.68 808.629L-692.994 404.314L-647.386 358.707ZM-288.68 0L-55.0578 233.622H-176.359L-288.68 121.301L-401 233.622H-522.301L-288.68 0Z'
	// 				fill={theme.palette.error.lighter}
	// 				opacity={theme.palette.mode === 'dark' ? '0.9' : '1'}
	// 			/>
	// 		</svg> */}
	// 		{/* <svg
	// 			width='100%'
	// 			xmlnsXlink='http://www.w3.org/1999/xlink'
	// 			preserveAspectRatio='xMidYMid'
	// 			height='calc(100vh - 175px)'
	// 			viewBox='90 0 750 300'
	// 			fill='none'
	// 			xmlns='http://www.w3.org/2000/svg'
	// 		>
	// 			<image
	// 				xlinkHref='data:img/png;base64,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'
	// 				x='29'
	// 				y='32'
	// 				width='58'
	// 				height='158'
	// 			/>
	// 			<image
	// 				xlinkHref='data:img/png;base64,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'
	// 				x='143'
	// 				y='32'
	// 				width='58'
	// 				height='158'
	// 			/>
	// 			<image
	// 				xlinkHref='data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJIAAACdCAMAAABo89FpAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAC31BMVEUAAAAKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YAAABEu+IsAAAA83RSTlMAXOX99fHaz8O0pJOAa1ZIOSoaCVnd9N/Ks5l/ZEMg7sendw/rwoU/FQfqqmUzDrZ5POm7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'
	// 				x='145'
	// 				y='32'
	// 				width='146'
	// 				height='157'
	// 			/>
	// 			<image
	// 				xlinkHref='data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAABUAgMAAACnwGzrAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACVBMVEUAAAAKs8YAAAAmuQm4AAAAAnRSTlMAmf9A5tgAAAABYktHRACIBR1IAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAJklEQVQ4y2MIRQUBDENHYFiDwRLIIzxe0DznMIQERjgYLNFAugAA08HnhXLcyX0AAAAASUVORK5CYII='
	// 				x='82'
	// 				y='68'
	// 				width='62'
	// 				height='84'
	// 			/>
	// 			<image
	// 				xlinkHref='data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABJCAMAAAAQexaYAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAh1BMVEUAAAAKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YKs8YovM2a3+fg9Pf3+/xPyNbx+fr9/f3w+fqc3+fh9feb3+cAAABEs4XNAAAAIHRSTlMAHni54/jz17ghpvz9TvJZb/5xV6WnH3fk+SBYc1r6IpsZW7EAAAABYktHRACIBR1IAAAACXBIWXMAAC4jAAAuIwF4pT92AAAA40lEQVQ4y+2UyxqCIBCFR0kzo4sZaloGXjD1/d8vvKBYumnTxn/lnCMzA8MHQIemo41hbi19Byqavac92NZG/XCkCuZJ6mdMJziXTnedXmBJmqUJE47b5jd7PedFA89FtqbOVf7/Kjq4WEMAPFmgLCSJ6M0DX5asBiMVkQ+WNLLByERkQTC/IgCDftUoRXQbDcaVroQxpFL30aRC41GwusqqmrXf1tjuFB9CPKfjEIDMGUQ9RHUk7bAi51N3ooVB3RdG+1AuAxkWYaJN74mOgjgOkP6ElZU/sj5k60M2O9ofH7I36ZVxFYmROfsAAAAASUVORK5CYII='
	// 				x='200'
	// 				y='74'
	// 				width='24'
	// 				height='73'
	// 			/>
	// 		</svg> */}
	// 		{/* <svg width='100%' height='calc(100vh - 175px)' viewBox='0 0 405 809' fill='none' xmlns='http://www.w3.org/2000/svg'>
	// 			<circle cx='15.869' cy='15.869' r='15.869' fill='#FFCE00' />
	// 			<rect x='12.207' y='3.38037' width='7.23026' height='7.23026' fill='black' />
	// 			<rect x='19.4373' y='10.6106' width='7.23026' height='7.23026' fill='black' />
	// 			<rect x='4.97656' y='10.6106' width='7.23026' height='7.23026' fill='black' />
	// 			<path d='M15.8221 28.7332L4.96594 17.7469L26.6782 17.7469L15.8221 28.7332Z' fill='black' />
	// 		</svg> */}
	// 	</Box>
	// );
};

export default AuthBackground;
