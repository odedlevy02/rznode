# generator-tsnode 
The ultimate framework for creating Nodejs microservices written in typescript.

The general architecture for microservices is to have a single service as an Api Gateway.
The api gateway will receive all requests and according to configuration decide where to route the services. It also manages any security and logging required for all api calls.

One you have the gateway you go on and create the Business logic layer of services. 

This framework wil get you up and running in minutes.

Rznode contains the following features:
1. No code voodoo. Its all generated and displayed for you so that you can debug and modify anything according to your requirements
2. Ability to create a configurable Api Gateway that is also extensible to any additional custom route
3. Auto generate of swagger for the Api Gateway
4. Ability to create a Node js express service containing a swagger support, docker support, jenkins support and even Kubernetes support
5. If you follow the structure of clients and server folders it will generate a generic package.json with scripts to build the entire project in one click!
6. If you follow the structure of clients and server folders it will generate the docker-compose file with environment params and correct service referencing
7. Generate a client docker file (for angular and react) that has a multistage build that takes the compiled output and runs it in Nginx
8. Add Prometheus counters that can be used for service measurements


This is a huge time saver for all the pluming that is done over and over for each new project and each new service.

If you are working in vscode I have also added VScode code snippets that you can paste in the JSONC section in order to generate swagger paths with ease.

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
1. Create a new express Typescript Node service
2. Create a new Api Gateway express Typescript Node service
3. Add a new module to service (adds a controller and service files under a folder)
4. Add a unit test to a service (using Mocha)
5. Add a client app docker file (multistage docker file for building Angular and React and hosting in Nginx)
6. Create a docker compose file for entire project
7. Generate a swagger file for the Api Gateway service
8. Generate a global package.json script for installing and transpiling the entire project in single command

### New service
A new folder will be created containing everything you need to start a new service including.
1. index.ts - the starting point of the app
2. A server.ts file containing the logic for running an express web server
3. An .env file for setting env data in the formant of KEY=value. Every param defined here will be displayed in the console when app starts
4. A Dockerfile ready dockerizing the service
5. A jenkins file
6. A basic swagger file
>The code is written in typescript so make sure to compile using tsc before running the service

To generate a new service:
1. in terminal cd to the root services folder 
2. run: yo rznode and select 'New Node service'
3. translile - cd to the new created service and run 'tsc' to make sure it compiles
4. .env file will contain the PORT env var. Change the value to your services unique port number
5. test by running:
```
node .
```

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
3. **appendToBody** - This enables to append properties from the request object into the the request body 
   1. reqPath - a path inside the req object from which we can extract data
   2. bodyPath - a path inside the object which will contain the value extracted from reqPath
4. **appendToQuery** - Similar to appendToBody yet this will append query params to the url 
   1. reqPath - a path inside the req object from which we can extract data
   2. queryParamName - the query param name that will store the value extracted from reqPath
5. **appendToHeader** - This enables to append properties from the request object into the the request header
   1.  reqPath - a path inside the req object from which we can extract data
   2.  headerKey - the header key name for storing the value extracted from reqPath
6. **isFileUpload** - boolean value. When set to true will support streaming a file to another service. This can be used in conjunction with appendToHeader for passing additional data like userId to the other server inside the header params 

Here is a sample of routes:
```
 {
    //Sample hosts with paths
    hosts: [
        {
            host: "http://localhost:3002", routes: [
                { source: "/users/getUserByParaId" },
				//Sample of post
                {source: "/users/appendToBody", method: "post",
                    middlewares: [authMiddleware],
                    appendToBody: [{ reqPath: "decodedToken.userId", bodyPath: "userId" }]},
                { source: "/users/createUser", target: "/users/createTheUsers",method:"post" },
				//Sample for get with appendToQuery
                {source: "/users/appendToQuery", method: "get",
                    middlewares: [authMiddleware],
                    appendToQuery: [{ reqPath: "decodedToken.userId", queryParamName: "userId" }]},
				//Sample with file upload and appendToHeader	
				{source: "/devices/importDevices",method:"post",isFileUpload:true,inputSample:{file:"file"},appendToHeader:[
                    { reqPath: "decodedToken.organizationId", headerKey: "organizationId" }
                ]},
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
#### Generating swagger.json from routes
Since there is a config for defining routes it is also possible to enrich the routes config so that it will contain enough information to generate swagger.json paths

To support auto generate of swagger it is possible to add to each route the following fields:
1. **description** - will be displayed inside swagger summary
2. **tag** - a string that will be placed in swagger tags list for grouping apis
3. **inputSample** - a json containing sample data. It will behave different for different type of routes
   1. **post, put and patch** - the json will be converted to json Schema and will be displayed as the **body** in swagger parameter
   2. **get and delete** - the json should be flat and each key value pair will be converted to **query** parameters in swagger
   3. **isFileUpload** - when the route is for files, the inputSample first key name will be used as the name of the **formData** file name. Other properties will be ignored. For instance if you want the file key name to be called myFile, set the inputSample to {myFile:""}

Here is a modified routesConfig sample:
```
{
    //Sample hosts with paths
    hosts: [
        {
             host: "http://localhost:3002", routes: [
                { source: "/users/getUserByParaId" },
				//Sample of post 
                {source: "/users/appendToBody", method: "post",
                    middlewares: [authMiddleware], tag: "Users", inputSample:{name:"John",age:12}, description:"Add a new user",
                    appendToBody: [{ reqPath: "decodedToken.userId", bodyPath: "userId" }]},
                { source: "/users/createUser", target: "/users/createTheUsers",method:"post" },
				//Sample for get with appendToQuery
                {source: "/users/appendToQuery", method: "get",
                    middlewares: [authMiddleware],
                    appendToQuery: [{ reqPath: "decodedToken.userId", queryParamName: "userId" }]},
				//Sample with file upload and appendToHeader	
				{source: "/devices/importDevices",method:"post",isFileUpload:true,inputSample:{file:"file"},appendToHeader:[
                    { reqPath: "decodedToken.organizationId", headerKey: "organizationId" }
                ]},
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

Once completed run yo rznode and select 'generate swagger in Api gateway'
This will only create swagger paths that are not already defined in swagger.json paths.therefore you can modify the files and not worry about overriding the modifications


### New Module
Adding a new module will create a folder by the module name and 2 classes. One for defining the routes and the second for defining a service that should contain the business logic.

To generate the module:
1. in terminal cd to the root folder of your service (e.g. servers/servicea)
2. run: yo rznode and select 'New Module'
3. A new folder was added with the name of you module containing 2 new files
   1. <module>.route.ts
   2. <module>.service.ts

> NOTE When using the generator to generate a new route it is required to manually add the exported router method from the generated route into the server.ts inside method: setRoutes()

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

### Add a client app docker file
Client applications written with Angular or React are packed using web pack prior to release. 
You are required to host the applications with a web server in order to serve the static pages.
**RZNODE** will generate a multistage docker file that will first create the packed static files and will then copy the result to smaller docker image with Nginx that will host the static files.

To generate the docker:
1. in terminal cd to the root folder of your client app
2. run: yo rznode and select 'Client Dockerfile' 
3. A new 'Dockerfile' was added to your project. Follow the instruction in the dockerfile in order to build the image

### Create a docker compose file for the project 
Assuming your project is build in the following structure:
```
clients
		-<your client app>
servers
	- gateway service
	- server a
	- server b
```
You can generate a docker compose yaml file that will contain all the services and client apps

To generate the docker compose file:
1. in terminal cd to the root folder of your solution (folder containing servers and clients apps)
2. run: yo rznode and select 'Create Docker Compose file' 
3. Review the generated file to validate that it is correct and then run 'docker-compose build' 

### Generate a global package.json script
When your solution structure is as following:
```
clients
		-<your client app>
servers
	- gateway service
	- server a
	- server b
```
and you have multiple services and one or more client, it is possible to generate a global 'package.json' scripts that will enable to run npm install and transpile using tsc all of the solution in single click.

To generate the scripts:
1. in terminal cd to the root folder of your solution (folder containing servers and clients apps)
2. if you do not have a package.json in your root folder add one by running:
```
npm init -y
```
3. run: yo rznode and select 'Global package json scripts' 
4. Open the package.json and validate that the scripts were build
5. Test by running
```
npm run install:all
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

