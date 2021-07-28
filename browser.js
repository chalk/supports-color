/* eslint-env browser */

const isBlinkBasedBrowser = typeof navigator !== 'undefined' ? /\b(Chrome|Chromium)\//.test(navigator.userAgent): false;

const colorSupport = isBlinkBasedBrowser ? {
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
