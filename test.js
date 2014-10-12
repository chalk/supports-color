'use strict';
var assert = require('assert');
var requireUncached = require('require-uncached');

beforeEach(function () {
	process.stdout.isTTY = true;
	process.argv = [];
	process.env = {};
});

it('should return false if not TTY', function () {
	process.stdout.isTTY = false;
	assert.equal(requireUncached('./'), false);
});

it('should return false if --no-color flag is used', function () {
	process.argv = ['--no-color'];
	assert.equal(requireUncached('./'), false);
});

it('should return false if --no-colors flag is used', function () {
	process.argv = ['--no-colors'];
	assert.equal(requireUncached('./'), false);
});

it('should return true if --color flag is used', function () {
	process.argv = ['--color'];
	assert.equal(requireUncached('./'), true);
});

it('should return true if --colors flag is used', function () {
	process.argv = ['--colors'];
	assert.equal(requireUncached('./'), true);
});

it('should return true if `COLORTERM` is in env', function () {
	process.env.COLORTERM = true;
	assert.equal(requireUncached('./'), true);
});

it('should support `--color=true` flag', function () {
	process.argv = ['--color=true'];
	assert.equal(requireUncached('./'), true);
});

it('should support `--color=always` flag', function () {
	process.argv = ['--color=always'];
	assert.equal(requireUncached('./'), true);
});

it('should support `--color=false` flag', function () {
	process.argv = ['--color=false'];
	assert.equal(requireUncached('./'), false);
});
