'use strict';
const assert = require('assert');
const requireUncached = require('require-uncached');

beforeEach(() => {
	process.stdout.isTTY = true;
	process.argv = [];
	process.env = {};
});

it('should return true if `FORCE_COLOR` is in env', () => {
	process.env.FORCE_COLOR = true;
	const result = requireUncached('./');
	assert.equal(Boolean(result), true);
	assert.equal(result.level, 1);
});

it('should return true if `FORCE_COLOR` is in env, but honor 256', () => {
	process.argv = ['--color=256'];
	process.env.FORCE_COLOR = true;
	const result = requireUncached('./');
	assert.equal(Boolean(result), true);
	assert.equal(result.level, 2);
});

it('should return true if `FORCE_COLOR` is in env, but honor 256', () => {
	process.argv = ['--color=256'];
	process.env.FORCE_COLOR = '1';
	const result = requireUncached('./');
	assert.equal(Boolean(result), true);
	assert.equal(result.level, 2);
});

it('should return false if `FORCE_COLOR` is in env and is 0', () => {
	process.env.FORCE_COLOR = '0';
	const result = requireUncached('./');
	assert.equal(Boolean(result), false);
});

it('should return false if not TTY', () => {
	process.stdout.isTTY = false;
	const result = requireUncached('./');
	assert.equal(Boolean(result), false);
});

it('should return false if --no-color flag is used', () => {
	process.env = {TERM: 'xterm-256color'};
	process.argv = ['--no-color'];
	const result = requireUncached('./');
	assert.equal(Boolean(result), false);
});

it('should return false if --no-colors flag is used', () => {
	process.env = {TERM: 'xterm-256color'};
	process.argv = ['--no-colors'];
	const result = requireUncached('./');
	assert.equal(Boolean(result), false);
});

it('should return true if --color flag is used', () => {
	process.argv = ['--color'];
	const result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('should return true if --colors flag is used', () => {
	process.argv = ['--colors'];
	const result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('should return true if `COLORTERM` is in env', () => {
	process.env.COLORTERM = true;
	const result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('should support `--color=true` flag', () => {
	process.argv = ['--color=true'];
	const result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('should support `--color=always` flag', () => {
	process.argv = ['--color=always'];
	const result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('should support `--color=false` flag', () => {
	process.env = {TERM: 'xterm-256color'};
	process.argv = ['--color=false'];
	const result = requireUncached('./');
	assert.equal(Boolean(result), false);
});

it('should support `--color=256` flag', () => {
	process.argv = ['--color=256'];
	const result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('level should be 2 if `--color=256` flag is used', () => {
	process.argv = ['--color=256'];
	const result = requireUncached('./');
	assert.equal(result.level, 2);
	assert.equal(result.has256, true);
});

it('should support `--color=16m` flag', () => {
	process.argv = ['--color=16m'];
	const result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('should support `--color=full` flag', () => {
	process.argv = ['--color=full'];
	const result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('should support `--color=truecolor` flag', () => {
	process.argv = ['--color=truecolor'];
	const result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('level should be 3 if `--color=16m` flag is used', () => {
	process.argv = ['--color=16m'];
	const result = requireUncached('./');
	assert.equal(result.level, 3);
	assert.equal(result.has256, true);
	assert.equal(result.has16m, true);
});

it('should ignore post-terminator flags', () => {
	process.argv = ['--color', '--', '--no-color'];
	const result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('should allow tests of the properties on false', () => {
	process.env = {TERM: 'xterm-256color'};
	process.argv = ['--no-color'];
	const result = requireUncached('./');
	assert.equal(Boolean(result.hasBasic), false);
	assert.equal(Boolean(result.has256), false);
	assert.equal(Boolean(result.has16m), false);
	assert.equal(result.level > 0, false);
});

it('should return false if `CI` is in env', () => {
	process.env.CI = 'AppVeyor';
	const result = requireUncached('./');
	assert.equal(Boolean(result), false);
});

it('should return true if `TRAVIS` is in env', () => {
	process.env = {CI: 'Travis', TRAVIS: '1'};
	const result = requireUncached('./');
	assert.equal(Boolean(result), true);
});

it('should return false if `TEAMCITY_VERSION` is in env and is < 9.1', () => {
	process.env.TEAMCITY_VERSION = '9.0.5 (build 32523)';
	const result = requireUncached('./');
	assert.equal(Boolean(result), false);
});

it('should return level 1 if `TEAMCITY_VERSION` is in env and is >= 9.1', () => {
	process.env.TEAMCITY_VERSION = '9.1.0 (build 32523)';
	const result = requireUncached('./');
	assert.equal(result.level, 1);
});

it('should prefer level 2/xterm over COLORTERM', () => {
	process.env = {COLORTERM: '1', TERM: 'xterm-256color'};
	const result = requireUncached('./');
	assert.equal(result.level, 2);
});

it('should support screen-256color', () => {
	process.env = {TERM: 'screen-256color'};
	const result = requireUncached('./');
	assert.equal(result.level, 2);
});
