'use strict';
var hasFlag = require('has-flag');

var support = function (level) {
	if (level === 0) {
		return false;
	}
	var result = {};
	result.level = level;
	result.hasBasic = true;
	result.has256 = level >= 2;
	result.has16m = level >= 3;
	return result;
};

var supportLevel = (function () {
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

	if ('COLORTERM' in process.env) {
		return 1;
	}

	if (process.env.TERM === 'dumb') {
		return 0;
	}

	if (/^xterm-256(?:color)?/.test(process.env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
		return 1;
	}

	return 0;
})();

if (supportLevel === 0 && 'FORCE_COLOR' in process.env) {
	supportLevel = 1;
}

module.exports = support(supportLevel);
