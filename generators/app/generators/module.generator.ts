import { camelCase, paramCase, pascalCase, sentenceCase, snakeCase } from 'change-case'
const chalk = require('chalk');
import * as Generator from "yeoman-generator"
export function generateModule(generator: Generator) {
    let modulename = pascalCase(generator["props"].modulename); // FirstLetterCapital
    let modulenameLower = camelCase(generator["props"].modulename) //firstLetterLowerCase
    const moduleServiceName = `${modulename}Service`
    const entityName = generator["props"].entityName

    const baseRoutesFolderName = `routes/${modulenameLower}`
    if (!entityName) {

        generator.fs.copyTpl(
            generator.templatePath(`router.js`),
            generator.destinationPath(`${baseRoutesFolderName}/${modulenameLower}.router.ts`), {
            modulename, modulenameLower
        });
        generator.fs.copyTpl(
            generator.templatePath(`service.js`),
            generator.destinationPath(`${baseRoutesFolderName}/${modulenameLower}.service.ts`), {
            modulename, modulenameLower, moduleServiceName
        });
    } else {
        const entityNameCamel = camelCase(entityName) //myGame
        const entityNameSnake = snakeCase(entityName) //my_game
        const entityNamePascal = pascalCase(entityName) //MyGame
        const entityClassName = `${entityNamePascal}Entity`
        generator.fs.copyTpl(
            generator.templatePath(`typeorm/baseEntity.js`),
            generator.destinationPath(`entities/${entityNameCamel}.entity.ts`), {
            entityNameCamel, entityNameSnake, entityNamePascal, entityClassName
        });
        generator.fs.copyTpl(
            generator.templatePath(`typeorm/router.js`),
            generator.destinationPath(`${baseRoutesFolderName}/${modulenameLower}.router.ts`), {
            modulename, modulenameLower, moduleServiceName, entityNameCamel, entityNameSnake, entityNamePascal, entityClassName
        });
        generator.fs.copyTpl(
            generator.templatePath(`typeorm/service.js`),
            generator.destinationPath(`${baseRoutesFolderName}/${modulenameLower}.service.ts`), {
            modulename, modulenameLower, moduleServiceName, entityNameCamel, entityNameSnake, entityNamePascal, entityClassName
        });
        const swaggerPath = "./swagger.json"
        const swagger = generator.fs.readJSON(swaggerPath)
        //get all and create swagger
        const getAllCreate = getAllCreateSwagger(modulenameLower, entityNamePascal, entityNameCamel)
        swagger.paths[getAllCreate.propName] = getAllCreate.path
        //get and delete by id
        const getAndDeleteById = getAndDeleteByIdSwagger(modulenameLower, entityNamePascal, entityNameCamel)
        swagger.paths[getAndDeleteById.propName] = getAndDeleteById.path

        generator.fs.delete(swaggerPath)
        generator.fs.commit(() => { })
        generator.fs.writeJSON(swaggerPath, swagger)
    }

    //Note - add to server.ts method setRoutes:  this.app.use("/ordersManage",ordersManageRouter);
    generator.log(chalk.blue("NOTE - make sure to add to 'server.ts' in method 'setRoutes'"))
    generator.log(chalk.green(`this.app.use("/${modulenameLower}",${modulenameLower}Router)`))
}

function getAllCreateSwagger(modulenameLower, entityNamePascal, entityNameCamel): { propName, path } {
    const path = {
        "get": {
            "tags": [
                `${entityNamePascal}`
            ],
            "summary": `Get all ${entityNameCamel}`,
            "parameters": [
                {
                    "in": "query",
                    "name": "limit"
                }
            ],
            "responses": {
                "200": {
                    "description": `list of ${entityNameCamel}`
                }
            }
        },
        "post": {
            "tags": [
                `${entityNamePascal}`
            ],
            "summary": `save a ${entityNameCamel}  (create or update)`,
            "parameters": [
                {
                    "in": "body",
                    "name": "path",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string"
                            }
                        }
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "new item"
                }
            }
        }

    }
    return { path, propName: `/${modulenameLower}` };
}

function getAndDeleteByIdSwagger(modulenameLower, entityNamePascal, entityNameCamel): { propName, path } {
    const path = {
        "get": {
            "tags": [
                `${entityNamePascal}`
            ],
            "summary": `Get ${entityNameCamel} by id`,
            "parameters": [
                {
                    "in": "path",
                    "name": "id"
                }
            ],
            "responses": {
                "200": {
                    "description": `${entityNameCamel}`
                }
            }
        },
        "delete": {
            "tags": [
                `${entityNamePascal}`
            ],
            "summary": `delete ${entityNameCamel} by id`,
            "parameters": [
                {
                    "in": "path",
                    "name": "id"
                }
            ],
            "responses": {
                "200": {
                    "description": `number of ${entityNameCamel} deleted`
                }
            }
        }
    }
    return { path, propName: `/${modulenameLower}/{id}` };
}