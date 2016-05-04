# stupid-shrink
npm shrinkwrap without any checks


## Usage

    node stupid-shrink.js

Writes an npm-shrinkwrap.json file without doing any checks before writing.

This script should produce the exact same output as:

    npm shrinkwrap --dev


## About

Written to work around bug: https://github.com/npm/npm/issues/5135

Tested on OSX with a moderately complex set of dependencies.

Tested with npm 3.8.7
