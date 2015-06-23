'use strict';
var argv = process.argv;

module.exports = (function () {
    var index;

	if ('FORCE_COLOR' in process.env) {
		return true;
	}

    // Do not consider arguments beyond the -- flag terminator.
    index = argv.indexOf('--');
    if (index !== -1) {
        argv = argv.slice(0, index);
    }

    index = argv.indexOf('--no-color');
    if (index !== -1) {
        process.argv.splice(index, 1);
        return false;
    }

    index = argv.indexOf('--no-colors');
    if (index !== -1) {
        process.argv.splice(index, 1);
        return false;
    }

    index = argv.indexOf('--color=false');
    if (index !== -1) {
        process.argv.splice(index, 1);
        return false;
    }

    index = argv.indexOf('--color');
    if (index !== -1) {
        process.argv.splice(index, 1);
        return true;
    }

    index = argv.indexOf('--colors');
    if (index !== -1) {
        process.argv.splice(index, 1);
        return true;
    }

    index = argv.indexOf('--color=true');
    if (index !== -1) {
        process.argv.splice(index, 1);
        return true;
    }

    index = argv.indexOf('--color=always');
    if (index !== -1) {
        process.argv.splice(index, 1);
        return true;
    }

	if (process.stdout && !process.stdout.isTTY) {
		return false;
	}

	if (process.platform === 'win32') {
		return true;
	}

	if ('COLORTERM' in process.env) {
		return true;
	}

	if (process.env.TERM === 'dumb') {
		return false;
	}

	if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
		return true;
	}

	return false;
})();
