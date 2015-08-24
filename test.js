'use strict';
var assert = require('assert');
var requireUncached = require('require-uncached');

beforeEach(function () {
	process.stdout.isTTY = true;
	process.argv = [];
	process.env = {};
});

it('should return true if `FORCE_COLOR` is in env', function () {
	process.env.FORCE_COLOR = true;
	var result = requireUncached('./');
	assert.equal(Boolean(result), true);
	assert.equal(result.level, 1);
});

it('should return false if not TTY', function () {
	process.stdout.isTTY = false;
	var result = requireUncached('./');
	assert.equal(Boolean(result), false);
});

it('should return false if --no-color flag is used', function () {
	process.env = {TERM: 'xterm-256color'};
	process.argv = ['--no-color'];
	var result = requireUncached('./');
	assert.equal(Boolean(result), false);
});

it('should return false if --no-colors flag is used', function () {
	process.env = {TERM: 'xterm-256color'};
	process.argv = ['--no-colors'];
	var result = requireUncached('./');
	assert.equal(Boolean(result), false);
});

it('should return true if --color flag is used', function () {
	process.argv = ['--color'];
	var result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('should return true if --colors flag is used', function () {
	process.argv = ['--colors'];
	var result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('should return true if `COLORTERM` is in env', function () {
	process.env.COLORTERM = true;
	var result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('should support `--color=true` flag', function () {
	process.argv = ['--color=true'];
	var result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('should support `--color=always` flag', function () {
	process.argv = ['--color=always'];
	var result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('should support `--color=false` flag', function () {
	process.env = {TERM: 'xterm-256color'};
	process.argv = ['--color=false'];
	var result = requireUncached('./');
	assert.equal(Boolean(result), false);
});

it('should support `--color=256` flag', function () {
	process.argv = ['--color=256'];
	var result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('level should be 2 if `--color=256` flag is used', function () {
	process.argv = ['--color=256'];
	var result = requireUncached('./');
	assert.equal(result.level, 2);
	assert.equal(result.has256, true);
});

it('should support `--color=16m` flag', function () {
	process.argv = ['--color=16m'];
	var result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('should support `--color=full` flag', function () {
	process.argv = ['--color=full'];
	var result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('should support `--color=truecolor` flag', function () {
	process.argv = ['--color=truecolor'];
	var result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('level should be 3 if `--color=16m` flag is used', function () {
	process.argv = ['--color=16m'];
	var result = requireUncached('./');
	assert.equal(result.level, 3);
	assert.equal(result.has256, true);
	assert.equal(result.has16m, true);
});

it('should ignore post-terminator flags', function () {
	process.argv = ['--color', '--', '--no-color'];
	var result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('should allow tests of the properties on false', function () {
	process.env = {TERM: 'xterm-256color'};
	process.argv = ['--no-color'];
	var result = requireUncached('./');
	assert.equal(Boolean(result.hasBasic), false);
	assert.equal(Boolean(result.has256), false);
	assert.equal(Boolean(result.has16m), false);
	assert.equal(result.level > 0, false);
});
