/* eslint-env browser */

function getChromeVersion() {
	return parseInt(String(navigator.userAgent).split(/\b(Chrome|Chromium)\//).pop());
}

const colorSupport = getChromeVersion() >= 69 ? {
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
