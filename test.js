'use strict';
var assert = require('assert');

beforeEach(function () {
	// clear the cache of the tested module
	delete require.cache[require.resolve('./index')];
	process.stdout.isTTY = true;
	process.argv = [];
	process.env = {};
});

it('should return false if not TTY', function () {
	process.stdout.isTTY = false;
	assert.equal(require('./index'), false);
});

it('should return false if --no-color flag is used', function () {
	process.argv = ['--no-color'];
	assert.equal(require('./index'), false);
});

it('should return true if --color flag is used', function () {
	process.argv = ['--color'];
	assert.equal(require('./index'), true);
});

it('should return true if `COLORTERM` is in env', function () {
	process.env.COLORTERM = true;
	assert.equal(require('./index'), true);
});
