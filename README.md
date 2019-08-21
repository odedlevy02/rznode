# generator-tsnode [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
This generator assists in creating a basic structure for Node web apps using Express and is written in Typescript.

The Generator also enables adding routes, unit tests and a logger based on Winston
The logger support overwriting code using console.log and writing the logs to the file system or to AWS S3

## Installation

First, install [Yeoman](http://yeoman.io) and generator-rznode using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-rznode
```

Then generate your new project:

```bash
yo rznode
```

## Usage
### New Routes
> When using the generator to generate a new route it is required to manually add the exported router method from the generated route
> file into the server.ts inside method: setRoutes()




MIT License © [Oded Levy]()


[npm-image]: https://badge.fury.io/js/generator-tsnode.svg
[npm-url]: https://npmjs.org/package/generator-tsnode
[travis-image]: https://travis-ci.org/odedlevy02/generator-tsnode.svg?branch=master
[travis-url]: https://travis-ci.org/odedlevy02/generator-tsnode
[daviddm-image]: https://david-dm.org/odedlevy02/generator-tsnode.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/odedlevy02/generator-tsnode
[coveralls-image]: https://coveralls.io/repos/odedlevy02/generator-tsnode/badge.svg
[coveralls-url]: https://coveralls.io/r/odedlevy02/generator-tsnode
