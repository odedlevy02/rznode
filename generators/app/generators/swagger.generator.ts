import { existsSync, readFileSync, writeFileSync } from "fs";
import * as toJsonSchema from 'to-json-schema';
import * as path from "path";
export function generateSwagger(rootPath) {
    let routeConfig = loadRoutesConfig(rootPath)
    let swagger = loadSwaggerJson(rootPath);
    if (routeConfig && swagger) {
        updateSwaggerWithMissingRoutes(routeConfig, swagger)
        saveSwagger(swagger);
    }
}

//save the new swagger json to file
function saveSwagger(swagger) {
    writeFileSync("swagger.json", JSON.stringify(swagger, null, 4))
}

//iterate over configs and update missing swagger paths
function updateSwaggerWithMissingRoutes(routeConfig, swagger) {
    routeConfig.hosts.forEach(host => {
        host.routes.forEach(route => {
            let method = route.method ? route.method : "get"
            let doesPathExist = doesPathExistInSwagger(swagger, route.source, method)
            if (doesPathExist == false) {
                try {
                    createPathInSwagger(swagger, route, method)
                    console.log(`path: '[${method}] ${route.source}' added to swagger`)
                } catch (err) {
                    console.log(`failed to build swagger for path: ${route.source}. Error: ${err.message}`)
                }
            }
        })
    })

}

//Create a swagger path section from a route
function createPathInSwagger(swagger, route, method) {
    let swaggerPath = convertExpressPathToSwaggerPath(route.source);
    let parameters = [...getSwaggerParamFromInput(method, route.inputSample, route.source, route.isFileUpload)]
    let swaggerPathObj = {
        tags: [route.tag],
        summary: route.description,
        responses: { "200": { description: "result" } },
        parameters
    }
    //create base path if not exist
    if (!swagger.paths[swaggerPath]) {
        swagger.paths[swaggerPath] = {}
    }
    swagger.paths[swaggerPath][method] = swaggerPathObj
}

//convert the inputSample in route to a schema
function getSwaggerParamFromInput(method: string, input: any, expressPath: string, isFileUpload: boolean = false) {
    let paramsResult = []
    //path params are possible in all methods. Start by collecting them
    //if value found in input - remove the key so that it will not be used again in post and query
    let pathParams = extractUrlRestParams(expressPath)
    paramsResult = getPathParams(pathParams)
    if (input) {
        if (["put", "post", "patch"].includes(method)) {
            if (isFileUpload) { //if post of type file upload 
                let body = getFileUploadParam(input)
                paramsResult.push(body)
            } else {
                let body = getBodyParam(input)
                paramsResult.push(body)
            }

        } else { //if query params then create an array of items based on keys in object
            Object.keys(input).forEach(key => {
                let param = getQueryParam(key, input[key])
                if (param) {
                    paramsResult.push(param)
                }
            })
        }
    }
    return paramsResult;
}

function extractUrlRestParams(url) {
    let pathRegexp = new RegExp(":[a-zA-Z0-9]*", "g");
    let matches = url.match(pathRegexp)
    if (matches) {
        matches = matches.map(match => match.replace(":", ""))
    }
    return matches;
}

function getPathParams(paramsList: string[]) {
    let swaggerParams = [];
    if (paramsList) {
        //iterate over each param and create one
        paramsList.forEach(param => {
            swaggerParams.push({
                in: "path",
                name: param,
            })
        })
    }
    return swaggerParams;
}

function getQueryParam(keyName: string, keyValue) {
    //support only value types of string,number or array
    let param = {
        in: "query",
        name: keyName,
    }
    if (keyValue) {
        let type = typeof keyValue;
        //anything that is not a number - stringify it
        if (type != "number" && type != "string") {
            keyValue = JSON.stringify(keyValue);
        }
        if (type != null) {
            param["default"] = keyValue;
            param["type"] = type

        }
    }
    return param;
}


function getFileUploadParam(input) {
    if (input) {
        //when input placed in formData take the first param and use its name
        let keyName = Object.keys(input)[0]
        return {
            in: 'formData',
            name: keyName,
            type: "file"
        };
    }
    return null;
}

function getBodyParam(input) {
    if (input) {
        return {
            in: 'body',
            name: 'parameter',
            schema: jsonToSchema(input)
        };
    }
    return null;
}

function jsonToSchema(json) {
    return toJsonSchema(json,
        {
            strings: {
                detectFormat: false,
            },
            objects: {
                preProcessFnc: (value, defaultFnc) => {
                    const schema = defaultFnc(value);
                    schema.default = schema.example = value;
                    return schema;
                }
            }
        })
}

//express path params are /test/:id while swagger are /test/{id}
function convertExpressPathToSwaggerPath(expressPath) {
    let swaggerPath = expressPath
        .split("/")
        .map(part => {
            let result = part;
            if (part.includes(":")) {
                result = part.replace(":", "{") + "}"
            }
            return result
        })
        .join("/")
    return swaggerPath;
}

//validate if path and method from routes exist in swagger
function doesPathExistInSwagger(swagger: any, path: string, method: string) {
    //replace :val with {val}
    let expressToSwaggerPath = convertExpressPathToSwaggerPath(path);
    let swaggerPath = Object.keys(swagger.paths).filter(swaggerPath => swaggerPath == expressToSwaggerPath)
    if (swaggerPath && swaggerPath.length > 0 && swagger.paths[swaggerPath[0]][method]) {
        return true;
    } else {
        return false;
    }
}

function loadRoutesConfig(rootPath) {
    let source = path.join(rootPath, "routesConfig")
    try {
        let rConfig = require(source)
        let routesConfig = rConfig.routesConfig
        return routesConfig;
    } catch (err) {
        console.log("routesConfig.js not found in this folder ", rootPath)
        return null;
    }
}

function loadSwaggerJson(rootPath) {
    let source = path.join(rootPath, "swagger.json")
    if (existsSync(source)) {
        let fileContent = readFileSync(source)
        return JSON.parse(<any>fileContent);
    } else {
        console.log("swagger.json file does not exist in this folder ", rootPath)
        return null;
    }
}
