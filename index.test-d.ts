import {stdout, stderr} from 'node:process';
import {expectType} from 'tsd';
import type {Options, ColorInfo} from './index.d';
import supportsColor, {createSupportsColor} from './index.js';

const options: Options = {};

expectType<ColorInfo>(supportsColor.stdout);
expectType<ColorInfo>(supportsColor.stderr);

expectType<ColorInfo>(createSupportsColor(stdout));
expectType<ColorInfo>(createSupportsColor(stderr));
expectType<ColorInfo>(createSupportsColor(undefined));

expectType<ColorInfo>(createSupportsColor(stdout, options));
