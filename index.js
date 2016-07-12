'use strict';
var hasFlag = require('has-flag');
var stdoutSupport = require('./stdout')

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

var supportLevel = (function (stream) {
	stream = stream || process.stdout
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

	if (stream && !stream.isTTY) {
		return 0;
	}

	if (process.platform === 'win32') {
		return 1;
	}

	if ('CI' in process.env || 'TEAMCITY_VERSION' in process.env) {
		return 0;
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
})(stream);

if (supportLevel === 0 && 'FORCE_COLOR' in process.env) {
	supportLevel = 1;
}

module.exports = (function (stream) { return process && support(supportLevel(stream)); })(stream)
