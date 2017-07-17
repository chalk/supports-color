import os from 'os';
import {serial as test} from 'ava';
import importFresh from 'import-fresh';

test.beforeEach(() => {
	Object.defineProperty(process, 'platform', {
		value: 'linux'
	});
	process.stdout.isTTY = true;
	process.argv = [];
	process.env = {};
});

test('return true if `FORCE_COLOR` is in env', t => {
	process.env.FORCE_COLOR = true;
	const result = importFresh('.');
	t.truthy(result);
	t.is(result.level, 1);
});

test('return true if `FORCE_COLOR` is in env, but honor 256', t => {
	process.argv = ['--color=256'];
	process.env.FORCE_COLOR = true;
	const result = importFresh('.');
	t.truthy(result);
	t.is(result.level, 2);
});

test('return true if `FORCE_COLOR` is in env, but honor 256', t => {
	process.argv = ['--color=256'];
	process.env.FORCE_COLOR = '1';
	const result = importFresh('.');
	t.truthy(result);
	t.is(result.level, 2);
});

test('return false if `FORCE_COLOR` is in env and is 0', t => {
	process.env.FORCE_COLOR = '0';
	const result = importFresh('.');
	t.false(result);
});

test('return false if not TTY', t => {
	process.stdout.isTTY = false;
	const result = importFresh('.');
	t.false(result);
});

test('return false if --no-color flag is used', t => {
	process.env = {TERM: 'xterm-256color'};
	process.argv = ['--no-color'];
	const result = importFresh('.');
	t.false(result);
});

test('return false if --no-colors flag is used', t => {
	process.env = {TERM: 'xterm-256color'};
	process.argv = ['--no-colors'];
	const result = importFresh('.');
	t.false(result);
});

test('return true if --color flag is used', t => {
	process.argv = ['--color'];
	const result = importFresh('.');
	t.truthy(result);
});

test('return true if --colors flag is used', t => {
	process.argv = ['--colors'];
	const result = importFresh('.');
	t.truthy(result);
});

test('return true if `COLORTERM` is in env', t => {
	process.env.COLORTERM = true;
	const result = importFresh('.');
	t.truthy(result);
});

test('support `--color=true` flag', t => {
	process.argv = ['--color=true'];
	const result = importFresh('.');
	t.truthy(result);
});

test('support `--color=always` flag', t => {
	process.argv = ['--color=always'];
	const result = importFresh('.');
	t.truthy(result);
});

test('support `--color=false` flag', t => {
	process.env = {TERM: 'xterm-256color'};
	process.argv = ['--color=false'];
	const result = importFresh('.');
	t.false(result);
});

test('support `--color=256` flag', t => {
	process.argv = ['--color=256'];
	const result = importFresh('.');
	t.truthy(result);
});

test('level should be 2 if `--color=256` flag is used', t => {
	process.argv = ['--color=256'];
	const result = importFresh('.');
	t.is(result.level, 2);
	t.true(result.has256);
});

test('support `--color=16m` flag', t => {
	process.argv = ['--color=16m'];
	const result = importFresh('.');
	t.truthy(result);
});

test('support `--color=full` flag', t => {
	process.argv = ['--color=full'];
	const result = importFresh('.');
	t.truthy(result);
});

test('support `--color=truecolor` flag', t => {
	process.argv = ['--color=truecolor'];
	const result = importFresh('.');
	t.truthy(result);
});

test('level should be 3 if `--color=16m` flag is used', t => {
	process.argv = ['--color=16m'];
	const result = importFresh('.');
	t.is(result.level, 3);
	t.true(result.has256);
	t.true(result.has16m);
});

test('ignore post-terminator flags', t => {
	process.argv = ['--color', '--', '--no-color'];
	const result = importFresh('.');
	t.truthy(result);
});

test('allow tests of the properties on false', t => {
	process.env = {TERM: 'xterm-256color'};
	process.argv = ['--no-color'];
	const result = importFresh('.');
	t.is(result.hasBasic, undefined);
	t.is(result.has256, undefined);
	t.is(result.has16m, undefined);
	t.false(result.level > 0);
});

test('return false if `CI` is in env', t => {
	process.env.CI = 'AppVeyor';
	const result = importFresh('.');
	t.false(result);
});

test('return true if `TRAVIS` is in env', t => {
	process.env = {CI: 'Travis', TRAVIS: '1'};
	const result = importFresh('.');
	t.truthy(result);
});

test('return true if `CIRCLECI` is in env', t => {
	process.env = {CI: true, CIRCLECI: true};
	const result = importFresh('.');
	t.truthy(result);
});

test('return false if `TEAMCITY_VERSION` is in env and is < 9.1', t => {
	process.env.TEAMCITY_VERSION = '9.0.5 (build 32523)';
	const result = importFresh('.');
	t.false(result);
});

test('return level 1 if `TEAMCITY_VERSION` is in env and is >= 9.1', t => {
	process.env.TEAMCITY_VERSION = '9.1.0 (build 32523)';
	const result = importFresh('.');
	t.is(result.level, 1);
});

test('prefer level 2/xterm over COLORTERM', t => {
	process.env = {COLORTERM: '1', TERM: 'xterm-256color'};
	const result = importFresh('.');
	t.is(result.level, 2);
});

test('support screen-256color', t => {
	process.env = {TERM: 'screen-256color'};
	const result = importFresh('.');
	t.is(result.level, 2);
});

test('level should be 3 when using iTerm 3.0', t => {
	Object.defineProperty(process, 'platform', {
		value: 'darwin'
	});
	process.env = {
		TERM_PROGRAM: 'iTerm.app',
		TERM_PROGRAM_VERSION: '3.0.10'
	};
	const result = importFresh('.');
	t.is(result.level, 3);
});

test('level should be 2 when using iTerm 2.9', t => {
	Object.defineProperty(process, 'platform', {
		value: 'darwin'
	});
	process.env = {
		TERM_PROGRAM: 'iTerm.app',
		TERM_PROGRAM_VERSION: '2.9.3'
	};
	const result = importFresh('.');
	t.is(result.level, 2);
});

test('return level 1 if on Windows earlier than 10 build 10586 and Node version is < 8.0.0', t => {
	Object.defineProperty(process, 'platform', {
		value: 'win32'
	});
	Object.defineProperty(process.versions, 'node', {
		value: '7.5.0'
	});
	os.release = () => '10.0.10240';
	const result = importFresh('.');
	t.is(result.level, 1);
});

test('return level 1 if on Windows 10 build 10586 or later and Node version is < 8.0.0', t => {
	Object.defineProperty(process, 'platform', {
		value: 'win32'
	});
	Object.defineProperty(process.versions, 'node', {
		value: '7.5.0'
	});
	os.release = () => '10.0.10586';
	const result = importFresh('.');
	t.is(result.level, 1);
});

test('return level 1 if on Windows earlier than 10 build 10586 and Node version is >= 8.0.0', t => {
	Object.defineProperty(process, 'platform', {
		value: 'win32'
	});
	Object.defineProperty(process.versions, 'node', {
		value: '8.0.0'
	});
	os.release = () => '10.0.10240';
	const result = importFresh('.');
	t.is(result.level, 1);
});

test('return level 2 if on Windows 10 build 10586 or later and Node version is >= 8.0.0', t => {
	Object.defineProperty(process, 'platform', {
		value: 'win32'
	});
	Object.defineProperty(process.versions, 'node', {
		value: '8.0.0'
	});
	os.release = () => '10.0.10586';
	const result = importFresh('.');
	t.is(result.level, 2);
});
