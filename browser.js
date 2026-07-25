const level = (() => {
	if (!('navigator' in globalThis)) {
		return 0;
	}

	if (navigator.userAgentData) {
		const brand = navigator.userAgentData.brands.find(({brand}) => brand === 'Chromium');
		if (brand?.version > 93) {
			return 3;
		}
	}

	// eslint-disable-next-line require-unicode-regexp -- This entry point supports browsers without Unicode Sets.
	if (/\b(?:Chrome|Chromium)\//.test(navigator.userAgent)) {
		return 1;
	}

	return 0;
})();

const colorSupport = level !== 0 && {
	level,
	hasBasic: true,
	has256: level >= 2,
	has16m: level >= 3,
};

const supportsColor = {
	stdout: colorSupport,
	stderr: colorSupport,
};

export default supportsColor;
