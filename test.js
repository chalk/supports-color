'use strict';
var assert = require('assert');

beforeEach(function () {
	// clear the cache of the tested module
	delete require.cache[require.resolve('./')];
	process.stdout.isTTY = true;
	process.argv = [];
	process.env = {};
});

it('should return false if not TTY', function () {
	process.stdout.isTTY = false;
	assert.equal(require('./'), false);
});

it('should return false if --no-color flag is used', function () {
	process.argv = ['--no-color'];
	assert.equal(require('./'), false);
});

it('should return true if --color flag is used', function () {
	process.argv = ['--color'];
	assert.equal(require('./'), true);
});

it('should return true if `COLORTERM` is in env', function () {
	process.env.COLORTERM = true;
	assert.equal(require('./'), true);
});
