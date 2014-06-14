# supports-color [![Build Status](https://travis-ci.org/sindresorhus/supports-color.svg?branch=master)](https://travis-ci.org/sindresorhus/supports-color)

> Detect whether a terminal supports color


## Install

```sh
$ npm install --save supports-color
```


## Usage

```js
var supportsColor = require('supports-color');

if (supportsColor) {
	console.log('Terminal supports color');
}
```

It obeys the `--color` and `--no-color` CLI flags.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
