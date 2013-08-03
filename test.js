/*global describe, it, beforeEach */
'use strict';
var assert = require('assert');

describe('hasColor', function () {
	beforeEach(function () {
		// clear the cache of the tested module
		delete require.cache[require.resolve('./has-color')];
		process.stdout.isTTY = true;
		process.argv = [];
		process.env = {};
	});

	it('should return false if not TTY', function () {
		process.stdout.isTTY = false;
		assert.equal(require('./has-color'), false);
	});

	it('should return false if --no-color flag is used', function () {
		process.argv = ['--no-color'];
		assert.equal(require('./has-color'), false);
	});

	it('should return true if --color flag is used', function () {
		process.argv = ['--color'];
		assert.equal(require('./has-color'), true);
	});

	it('should return true if `COLORTERM` is in env', function () {
		process.env.COLORTERM = true;
		assert.equal(require('./has-color'), true);
	});
});
