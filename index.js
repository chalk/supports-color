'use strict';
var hasFlag = require('has-flag');

var support = function (level) {
	if (level === 0) {
		return false;
	}

	return {
		level: level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
};

var supportLevel = (function () {
	if (hasFlag('no-color') ||
		hasFlag('no-colors') ||
		hasFlag('color=false')) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (hasFlag('color') ||
		hasFlag('colors') ||
		hasFlag('color=true') ||
		hasFlag('color=always')) {
		return 1;
	}

	if (process.stdout && !process.stdout.isTTY) {
		return 0;
	}

	if (process.platform === 'win32') {
		return 1;
	}

	if ('CI' in process.env) {
		if ('TRAVIS' in process.env || process.env.CI === 'Travis') {
			return 1;
		}

		return 0;
	}

	if ('TEAMCITY_VERSION' in process.env) {
		return process.env.TEAMCITY_VERSION.match(/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/) === null ? 0 : 1;
	}

	if ('TERM' in process.env) {
		try {
			var colors = require('terminfo')().maxColors;
			if (colors && colors >= 8) {
				return Math.floor((colors - 8) / (256 - 8)) + 1;
			}
		} catch (err) {
			// swallow; it's an invalid terminal name
		}
	}

	if ('COLORTERM' in process.env) {
		return 1;
	}

	return 0;
})();

if (supportLevel === 0 && 'FORCE_COLOR' in process.env) {
	supportLevel = 1;
}

module.exports = process && support(supportLevel);
