/* eslint-env browser */

const isBlinkBasedBrowser = navigator.userAgentData ? Boolean(navigator.userAgentData.brands.find(({brand}) => brand === 'Chromium')) : /\b(Chrome|Chromium)\//.test(navigator.userAgent);

const colorSupport = isBlinkBasedBrowser ? {
	level: 1,
	hasBasic: true,
	has256: false,
	has16m: false,
} : false;

const supportsColor = {
	stdout: colorSupport,
	stderr: colorSupport,
};

export default supportsColor;
