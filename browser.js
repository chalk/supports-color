/* eslint-env browser */

function getFirefoxVersion() {
	const matches = /(Firefox)\/(?<version>\d+)\./.exec(navigator.userAgent);
	if (!matches) {
		return
	}
	return Number.parseInt(matches.groups.version, 10)
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3,
	};
}

function check() {
	if (navigator.userAgentData) {
		const brand = navigator.userAgentData.brands.find(({ brand }) => brand === 'Chromium');
		if (brand && brand.version > 100) {
			return 3
		}
	}
	if (getFirefoxVersion() && getFirefoxVersion() > 100) {
		return 3
	}
	if (/\b(Chrome|Chromium)\//.test(navigator.userAgent)) {
		return 1
	}
	return 0
}

const colorSupport = translateLevel(check());

const supportsColor = {
	stdout: colorSupport,
	stderr: colorSupport,
};

export default supportsColor;
