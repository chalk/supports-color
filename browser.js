/* eslint-env browser */

// Check for Blink-based browsers.
const isBlink = /\b(Chrome|Chromium)\//.test(navigator.userAgent);

const colorSupport = isBlink ? {
	level: 1,
	hasBasic: true,
	has256: false,
	has16m: false
} : false;

const supportsColor = {
	stdout: colorSupport,
	stderr: colorSupport
};

export default supportsColor;
