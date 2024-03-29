import { camelCase, paramCase, pascalCase, sentenceCase, snakeCase } from 'change-case'
import * as  pluralize from "pluralize"
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
        const entityNameCamelPlural = pluralize(entityNameCamel) //myGames
        const entityNameSnake = snakeCase(entityName) //my_game
        const entityNamePascal = pascalCase(entityName) //MyGame
        const entityNamePascalPlural = pluralize(entityNamePascal) //MyGame
        const entityClassName = `${entityNamePascal}Entity`
        generator.fs.copyTpl(
            generator.templatePath(`typeorm/baseEntity.js`),
            generator.destinationPath(`entities/${entityNameCamel}.entity.ts`), {
            entityNameCamel, entityNameSnake, entityNamePascal, entityClassName
        });
        generator.fs.copyTpl(
            generator.templatePath(`typeorm/router.js`),
            generator.destinationPath(`${baseRoutesFolderName}/${modulenameLower}.router.ts`), {
            modulename, modulenameLower, moduleServiceName, entityNameCamel, entityNameSnake, entityNamePascal, entityClassName,entityNameCamelPlural,entityNamePascalPlural
        });
        generator.fs.copyTpl(
            generator.templatePath(`typeorm/service.js`),
            generator.destinationPath(`${baseRoutesFolderName}/${modulenameLower}.service.ts`), {
            modulename, modulenameLower, moduleServiceName, entityNameCamel, entityNameSnake, entityNamePascal, entityClassName,entityNameCamelPlural,entityNamePascalPlural
        });
        const swaggerPath = "./swagger.json"
        const swagger = generator.fs.readJSON(swaggerPath)
        //get all and create swagger
        const getAllCreate = getAllCreateSwagger(modulenameLower, entityNameCamel,entityNamePascalPlural)
        swagger.paths[getAllCreate.propName] = getAllCreate.path
        //get and delete by id
        const getAndDeleteById = getAndDeleteByIdSwagger(modulenameLower, entityNameCamel,entityNamePascalPlural)
        swagger.paths[getAndDeleteById.propName] = getAndDeleteById.path

        generator.fs.delete(swaggerPath)
        generator.fs.commit(() => { })
        generator.fs.writeJSON(swaggerPath, swagger)
    }
    try {
        addRouteToServerFile(generator, modulenameLower)
    } catch (err) {
        generator.log(chalk.blue(`NOTE - update of server.js file did not complete with error: ${err.message}`))
        generator.log(chalk.blue("make sure to add to 'server.ts' in method 'setRoutes'"));
        generator.log(chalk.green(`this.app.use("/${modulenameLower}",${modulenameLower}Router)`))
    }


}

function addRouteToServerFile(generator, modulenameLower) {
    const file = generator.fs.read("server.ts")
    const splitContent = file.split("\n")
    //find the index of the last import
    let lastImportIndex = 0
    for (let index = 0; index < splitContent.length - 1; index++) {
        if (!splitContent[index].includes("import")) {
            lastImportIndex = index
            break;
        }
    }
    //add import after last index
    splitContent.splice(lastImportIndex , 0, `import { ${modulenameLower}Router } from "./routes/${modulenameLower}/${modulenameLower}.router";`)
    // find row starting with public setRoutes
    const indexStartRow = splitContent.findIndex(value => value.includes("public setRoutes"))
    //find the end row
    let endRow = null
    for (let index = indexStartRow; index < splitContent.length - 1; index++) {
        if (splitContent[index].trim() == "}") {
            endRow = index
            break;
        }
    }
    //append new content
    splitContent.splice(endRow, 0, `    this.app.use("/${modulenameLower}",${modulenameLower}Router)`)
    const updatedContent = splitContent.join("\n")
    generator.fs.delete("server.ts")
    generator.fs.commit(() => { })
    generator.fs.write("server.ts", updatedContent)
}

function getAllCreateSwagger(modulenameLower, entityNameCamel,entityNamePascalPlural): { propName, path } {
    const path = {
        "get": {
            "tags": [
                `${entityNamePascalPlural}`
            ],
            "summary": `Get all ${entityNamePascalPlural}`,
            "parameters": [
                {
                    "in": "query",
                    "name": "limit"
                }
            ],
            "responses": {
                "200": {
                    "description": `list of ${entityNamePascalPlural}`
                }
            }
        },
        "post": {
            "tags": [
                `${entityNamePascalPlural}`
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

function getAndDeleteByIdSwagger(modulenameLower, entityNameCamel,entityNamePascalPlural): { propName, path } {
    const path = {
        "get": {
            "tags": [
                `${entityNamePascalPlural}`
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
                `${entityNamePascalPlural}`
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