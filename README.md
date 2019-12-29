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

### New Api Gateway service
The Api Gateway service is an implementation based on **http-express-proxy** that enables to create an api gateway service.

An api gateway is a nodejs service that will sit in front of the backend and route all calls to the relevant service.
It will also take care of authentication middlewares and appending of additinoal information from the api gateway on to the backend service.

This service resembles in various parts the regular service defined in the previous section, yet does not require to code the routes
The code is layed out so that it will be possible to debug and modify the code as needed without any limitations.

#### Main parts
Like the regular service the starting point of the app is **index.ts** which starts off the service places in **service.ts**

In addition the file containing the routes configuration is located in **routesConfig.ts**. There is some sample data commented out.

#### Defining routes
The routes config has a list of hosts. Each host has the host base url and a list of routes
Each route must have at least a __source__ property with the relevant path.
When left empty the api gateway will to locate the same route inside the host service defined in the __host__ property
It is possible to route to a different location using the __target__ property.

Additional properties in a single route:
1. **method** - by default the method is __get__. You can set to one of the following:get, post, delete, put and patch
2. **middlewares** - a list of middleware that should be called prior to the route. The array needs a ref to method instance of type (req,res,next) or a method call that will return this method signature. Make sure to call next() in your middleware so that the flow will continue. Middlewares array can also be placed in the **host** level and will append the middlewares to all routes unless defined specifically inside the route. 
> NOTE - if you want to remove the middelware from a specific route - set an empty middelwares array in that route overriding the hosts middlewares
Here is a middleware sample:
```
function authMiddleware(req, res, next) {
     req.decodedToken = { userId: 1, roleId: 2}
     next();
 }
```
3. appendToBody - This enables to append properties from the request object into the the request body 
   1. reqPath - a path inside the req object from which we can extract data
   2. bodyPath - a path inside the object which will contain the value extracted from reqPath
4. appendToQuery - Similar to appendToBody yet this will append query params to the url 
   1. reqPath - a path inside the req object from which we can extract data
   2. queryParamName - the query param name that will store the value extracted from reqPath

Here is a sample of routes:
```
 {
    //Sample hosts with paths
    hosts: [
        {
            host: "http://localhost:3002", routes: [
                { source: "/users/getUserByParaId" },
                {source: "/users/appendToBody", method: "post",
                    middlewares: [authMiddleware],
                    appendToBody: [{ reqPath: "decodedToken.userId", bodyPath: "userId" }]},
                { source: "/users/createUser", target: "/users/createTheUsers",method:"post" },
                {source: "/users/appendToQuery", method: "get",
                    middlewares: [authMiddleware],
                    appendToQuery: [{ reqPath: "decodedToken.userId", queryParamName: "userId" }]},
            ]
        },
        {
            host: "http://localhost:3001",middlewares: [authMiddleware],routes: [  
                { source: "/api/*" },
            ]
        }
    ]

}
```

### New Module
Adding a new module will create a folder by the module name and 2 classes. One for defining the routes and the second for defining a service containing the buisness logic.

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

