# generator-tsnode 
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
When running the generator there are currently several options
1. Create a new service
2. Add a route to an existing service
3. Add a unit test
4. Add support for a swagger file

### New service
A new folder will be created containing everything you need to start a new service including.
> The code is written in typescript so make sure to compile using tsc before running
1. index.ts - the starting point of the app
2. A server.ts file containing the logic for running an express web server
3. An .env file for setting env data in the formant of KEY=value. Every param defined here will be displayed in the console when app starts
4. A Dockerfile ready dockerizing the service


### New Routes
> When using the generator to generate a new route it is required to manually add the exported router method from the generated route
> file into the server.ts inside method: setRoutes()

### New unit test
A test file will be added to the test folder.
In order to debug in vscode add the following to the launch.json:
```
{
    "type": "node",
    "request": "launch",
    "name": "razor-logger tests",
    "cwd": "${workspaceFolder}/<your service>",
    "program": "${workspaceFolder}/<your service>/node_modules/mocha/bin/_mocha",
    "args": [
        "--timeout",
        "999999",
        "--colors",
        "${workspaceFolder}/<your service>/test/**/*.js" //or "${workspaceFolder}/<your service>/**/*spec.js" for working with spec tests
    ],
    "outputCapture": "std",
    "internalConsoleOptions": "openOnSessionStart"
},
```

### Swagger
When adding support for swagger, open file server.ts and remove the comments from the following:
```
//import * as swaggerUi from "swagger-ui-express"
...
 public setSwagger=()=>{
    // let swaggerDocument = require('./swagger.json');
    // this.app.use('/explorer', swaggerUi.serve, swaggerUi.setup(swaggerDocument,{"showExplorer": true}));
    // console.log(`For exploring the apis open: http://localhost:${this.port}/explorer`)
  }
```
Then when running the server there is a log that links to the route to view the swagger in the browser:
```
For exploring the apis open: http://localhost:3000/explorer
```




Apache 2.0 License © [Oded Levy]()

