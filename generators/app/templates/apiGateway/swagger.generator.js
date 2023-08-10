import { existsSync, fstat, readFileSync, writeFileSync } from 'fs';
import * as toJsonSchema from 'to-json-schema';
import * as path from 'path';
/* istanbul ignore file */
export function generateSwagger(overwrite: boolean = true) {
  let rootPath = path.join(__dirname, '..');
  let routeConfig = loadRoutesConfig(rootPath);
  //static json will include the base part of the swagger json file + a list of static paths that are not generated
  let swagger = loadStaticSwaggerJson(rootPath);
  if (routeConfig && swagger) {
    updateSwaggerWithMissingRoutes(routeConfig, swagger);
    // mergeSwaggerWithStaticPaths(swagger)
    saveSwagger(swagger);
  }
}

function loadStaticSwaggerJson(rootPath) {
  let source = path.join(rootPath, 'swagger.static.json');
  if (existsSync(source)) {
    let fileContent = readFileSync(source);
    return JSON.parse(<any>fileContent);
  } else {
    console.log('swagger.static.json file does not exist in this folder ', rootPath);
    return null;
  }
}

// function mergeSwaggerWithStaticPaths(swagger:{paths:any}){
//     const staticSwagger = path.join( __dirname,"..","swagger.static.json")
//     if(existsSync(staticSwagger)){
//         let fileContent = readFileSync(staticSwagger)
//         const staticJson:{paths:any} = JSON.parse(<any>fileContent);
//         //if paths exist in swagger - replace. Else append
//         if(!staticJson.paths) return;
//         Object.keys(staticJson.paths).forEach(path=>{
//             swagger.paths[path] = staticJson.paths[path]
//         })

//     }
// }

//save the new swagger json to file
function saveSwagger(swagger) {
  writeFileSync('swagger.json', JSON.stringify(swagger, null, 4));
}

//iterate over configs and update missing swagger paths
function updateSwaggerWithMissingRoutes(routeConfig, swagger) {
  routeConfig.hosts.forEach(host => {
    host.routes.forEach(route => {
      let method = route.method ? route.method : 'get';
      let doesPathExist = doesPathExistInSwagger(swagger, route.source, method);
      if (doesPathExist == false) {
        try {
          createPathInSwagger(swagger, route, method);
          console.log(`path: '[${method}] ${route.source}' added to swagger`);
        } catch (err) {
          console.log(`failed to build swagger for path: ${route.source}. Error: ${err.message}`);
        }
      }
    });
  });
}

//Create a swagger path section from a route
function createPathInSwagger(swagger, route, method) {
  let swaggerPath = convertExpressPathToSwaggerPath(route.source);
  let parameters = [...getSwaggerParamFromInput(method, route.inputSample, route.source, route.isFileUpload)];
  let swaggerPathObj = {
    tags: [route.tag],
    deprecated: route.deprecated,
    summary: route.description,
    responses: { '200': { description: 'result' } },
    parameters,
  };
  //create base path if not exist
  if (!swagger.paths[swaggerPath]) {
    swagger.paths[swaggerPath] = {};
  }
  swagger.paths[swaggerPath][method] = swaggerPathObj;
}

//convert the inputSample in route to a schema
function getSwaggerParamFromInput(method: string, input: any, expressPath: string, isFileUpload: boolean = false) {
  let paramsResult = [];
  //path params are possible in all methods. Start by collecting them
  //if value found in input - remove the key so that it will not be used again in post and query
  let pathParams = extractUrlRestParams(expressPath);
  paramsResult = getPathParams(pathParams);
  if (input) {
    if (['put', 'post', 'patch'].includes(method)) {
      if (isFileUpload) {
        //if post of type file upload
        let body = getFileUploadParams(input);
        paramsResult.push(...body);
      } else {
        let body = getBodyParam(input);
        paramsResult.push(body);
      }
    } else {
      //if query params then create an array of items based on keys in object
      Object.keys(input).forEach(key => {
        let param = getQueryParam(key, input[key]);
        if (param) {
          paramsResult.push(param);
        }
      });
    }
  }
  return paramsResult;
}

/**
 * The file type input data can come in 2 options
 * 1. Simple object for scenario where only loading a file without metadata
 * 2. an array in which case we are passing a file and metadata
 * In option 1 the input will be in the format of {file:""} where the key is the name of the property
 * in option 2 the input format will be an array of {name: "string",type: "string",example:any }
 */
function getFileUploadParams(input): any[] {
  let paramsResult = [];
  if (input && Array.isArray(input)) {
    input.forEach(inputItem => {
      let inProp = inputItem.in || 'formData';
      let prop = {
        in: inProp,
        name: inputItem.name,
        type: inputItem.type,
      };
      if (inputItem.example) {
        if (typeof inputItem.example == 'string' || typeof inputItem.example == 'number') {
          prop['default'] = inputItem.example;
        } else {
          const example = JSON.stringify(inputItem.example);
          prop['default'] = example;
        }
      }
      paramsResult.push(prop);
    });
  } else {
    //when input placed in formData take the first param and use its name
    let keyName = Object.keys(input)[0];
    paramsResult.push({
      in: 'formData',
      name: keyName,
      type: 'file',
    });
  }
  return paramsResult;
}

function extractUrlRestParams(url) {
  let pathRegexp = new RegExp(':[a-zA-Z0-9]*', 'g');
  let matches = url.match(pathRegexp);
  if (matches) {
    matches = matches.map(match => match.replace(':', ''));
  }
  return matches;
}

function getPathParams(paramsList: string[]) {
  let swaggerParams = [];
  if (paramsList) {
    //iterate over each param and create one
    paramsList.forEach(param => {
      swaggerParams.push({
        in: 'path',
        name: param,
      });
    });
  }
  return swaggerParams;
}

function getQueryParam(keyName: string, keyValue) {
  //support only value types of string,number or array
  let param = {
    in: 'query',
    name: keyName,
  };
  if (keyValue) {
    let type = typeof keyValue;
    //anything that is not a number - stringify it
    if (type != 'number' && type != 'string') {
      keyValue = JSON.stringify(keyValue);
    }
    if (type != null) {
      param['default'] = keyValue;
      param['type'] = type;
    }
  }
  return param;
}

function getBodyParam(input) {
  if (input) {
    return {
      in: 'body',
      name: 'parameter',
      schema: jsonToSchema(input),
    };
  }
  return null;
}

function jsonToSchema(json) {
  return toJsonSchema(json, {
    strings: {
      detectFormat: false,
    },
    objects: {
      preProcessFnc: (value, defaultFnc) => {
        const schema = defaultFnc(value);
        schema.default = schema.example = value;
        return schema;
      },
    },
  });
}

//express path params are /test/:id while swagger are /test/{id}
function convertExpressPathToSwaggerPath(expressPath) {
  let swaggerPath = expressPath
    .split('/')
    .map(part => {
      let result = part;
      if (part.includes(':')) {
        result = part.replace(':', '{') + '}';
      }
      return result;
    })
    .join('/');
  return swaggerPath;
}

//validate if path and method from routes exist in swagger
function doesPathExistInSwagger(swagger: any, path: string, method: string) {
  //replace :val with {val}
  let expressToSwaggerPath = convertExpressPathToSwaggerPath(path);
  let swaggerPath = Object.keys(swagger.paths).filter(swaggerPath => swaggerPath == expressToSwaggerPath);
  if (swaggerPath && swaggerPath.length > 0 && swagger.paths[swaggerPath[0]][method]) {
    return true;
  } else {
    return false;
  }
}

function loadRoutesConfig(rootPath) {
  let source = path.join(rootPath, 'routesConfig');
  try {
    let rConfig = require(source);
    let routesConfig = rConfig.routesConfig;
    return routesConfig;
  } catch (err) {
    console.log('routesConfig.js not found in this folder ', rootPath);
    return null;
  }
}