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
2. Add a new module (for routing and logic)
3. Add a unit test
4. Add a client docker file
5. Create a docker compose file for entire project

### New service
A new folder will be created containing everything you need to start a new service including.
1. index.ts - the starting point of the app
2. A server.ts file containing the logic for running an express web server
3. An .env file for setting env data in the formant of KEY=value. Every param defined here will be displayed in the console when app starts
4. A Dockerfile ready dockerizing the service
5. A jenkins file
6. A basic swagger file
>The code is written in typescript so make sure to compile using tsc before running the service

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
Swagger is supported in service and a basic swagger.json file is added inside the project

I recommend adding these snippets to VSCode snippets for json files. It will make adding a new method inside the swagger file very easy.
```
	"Add swagger get method": {
		"prefix": "get",
		"body": [
			"\"/$path\": {",
			"            \"get\": {",
			"                \"tags\": [",
			"                    \"tagName\"",
			"                ],",
			"                \"summary\": \"Get all $path\",",
			"                \"parameters\": [],",
			"                \"responses\": {",
			"                    \"200\": {",
			"                        \"description\": \"list of $path\"",
			"                    }",
			"                }",
			"            }",
			"        }"
		],
		"description": "Add swagger get method"
	},
	"Add swagger post method": {
		"prefix": "post",
		"body": [
			"\"/$path\": {",
			"            \"post\": {",
			"                \"tags\": [",
			"                    \"$tagName\"",
			"                ],",
			"                \"summary\": \"my $path summary\",",
			"                \"parameters\": [",
			"                    {",
			"                        \"in\": \"body\",",
			"                        \"name\": \"$path\",",
			"                        \"schema\": {",
			"                            \"type\": \"object\",",
			"                            \"properties\": {",
			"                                \"id\": {",
			"                                    \"type\": \"number\"",
			"                                }",
			"                            }",
			"                        }",
			"                    }",
			"                ],",
			"                \"responses\": {",
			"                    \"200\": {",
			"                        \"description\": \"my description for $path\"",
			"                    }",
			"                }",
			"            }",
			"        }"
		],
		"description": "Add swagger post method"
	},
	"Add swagger auth": {
		"prefix": "auth",
		"body": [
			"\"securityDefinitions\": {",
			"        \"jwt\": {",
			"            \"type\": \"apiKey\",",
			"            \"in\": \"header\",",
			"            \"name\": \"Authorization\"",
			"        }",
			"    },",
			"    \"security\": [",
			"        {",
			"            \"jwt\": []",
			"        }",
			"    ],"
		],
		"description": "Add swagger auth"
	}
}
```
Then when running the server there is a log that links to the route to view the swagger in the browser:
```
For exploring the apis open: http://localhost:3000/explorer
```

### Docker
The service contains a Dockerfile inside. 
To build a docker image of your service just open the Dockerfile and copy the comment from the top:
For example:
```
#To build the docker file run: docker build -t gateway:latest .
```
### Docker file for client apps
If you want to run you client app as a stand alone docker image, you can add a client dockerfile to your client app root folder using 'yo rznode'
This will build a multi staged docker file for building the client app and then hosting it via nginx


### Docker compose
Once you have several services under a services folder, and even have a client app under a 'clients' folder open the command prompt under your root directory, run 'yo rznode' and select 'Create Docker compose file'. If your services are in the correct structure a file with all the services and environment settings will be generated for you


Apache 2.0 License © [Oded Levy]()

