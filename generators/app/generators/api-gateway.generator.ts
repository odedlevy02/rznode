import { camelCase, paramCase, pascalCase, sentenceCase, snakeCase } from 'change-case'
import * as path from "path"
import * as fs from "fs"
export function generateApiGatewayServer(generator) {
  let projnameParamCase = paramCase(generator.props.projname);
  generator.fs.copy(
    generator.templatePath(`apiGateway/index.js`),
    generator.destinationPath(`${projnameParamCase}/index.ts`));
  generator.fs.copy(
    generator.templatePath(`apiGateway/server.js`),
    generator.destinationPath(`${projnameParamCase}/server.ts`));
  generator.fs.copy(
    generator.templatePath(`serviceErrorReducer.js`),
    generator.destinationPath(`${projnameParamCase}/helpers/serviceErrorReducer.ts`));
  generator.fs.copy(
    generator.templatePath(`apiGateway/routesConfig.js`),
    generator.destinationPath(`${projnameParamCase}/routesConfig.ts`));
  generator.fs.copy(
    generator.templatePath(`apiGateway/IRoutesConfig.js`),
    generator.destinationPath(`${projnameParamCase}/apiGateway/IRoutesConfig.ts`));
  generator.fs.copy(
    generator.templatePath(`apiGateway/apiGatewayRouteBuilder.js`),
    generator.destinationPath(`${projnameParamCase}/apiGateway/apiGatewayRouteBuilder.ts`));
  generator.fs.copy(
    generator.templatePath(`apiGateway/appendPropertiesToBody.js`),
    generator.destinationPath(`${projnameParamCase}/apiGateway/appendPropertiesToBody.ts`));
  generator.fs.copy(
    generator.templatePath(`apiGateway/pathResolver.js`),
    generator.destinationPath(`${projnameParamCase}/apiGateway/pathResolver.ts`));
  generator.fs.copy(
    generator.templatePath(`apiGateway/appendPropertiesToHeader.js`),
    generator.destinationPath(`${projnameParamCase}/apiGateway/appendPropertiesToHeader.ts`));
  generator.fs.copy(
    generator.templatePath(`apiGateway/appendPropertiesToQuery.js`),
    generator.destinationPath(`${projnameParamCase}/apiGateway/appendPropertiesToQuery.ts`));
  generator.fs.copy(
    generator.templatePath(`apiGateway/uploadFileProxyMethod.js`),
    generator.destinationPath(`${projnameParamCase}/apiGateway/uploadFileProxyMethod.ts`));
  generator.fs.copy(
    generator.templatePath(`_tsconfig.json`),
    generator.destinationPath(`${projnameParamCase}/tsconfig.json`));
  generator.fs.copy(
    generator.templatePath(`.env`),
    generator.destinationPath(`${projnameParamCase}/.env`));
  generator.fs.copyTpl(
    generator.templatePath(`Dockerfile`),
    generator.destinationPath(`${projnameParamCase}/Dockerfile`), {
    projnameParamCase
  });
  generator.fs.copyTpl(
    generator.templatePath(`Jenkinsfile`),
    generator.destinationPath(`${projnameParamCase}/Jenkinsfile`), {
    projnameParamCase
  });
  generator.fs.copyTpl(
    generator.templatePath(`k8s-deploy.yaml`),
    generator.destinationPath(`${projnameParamCase}/${projnameParamCase}-k8s-deploy.yaml`), {
    projnameParamCase
  });
  generator.fs.copy(
    generator.templatePath(`.dockerignore`),
    generator.destinationPath(`${projnameParamCase}/.dockerignore`));
  generator.fs.copyTpl(
    generator.templatePath(`apiGateway/_swagger.json`),
    generator.destinationPath(`${projnameParamCase}/swagger.json`), {
    header: sentenceCase(projnameParamCase)
  });
  generator.fs.copyTpl(
    generator.templatePath(`_package.json`),
    generator.destinationPath(`${projnameParamCase}/package.json`), {
    projnameParamCase
  });

  installDependencies(generator);
}

function installDependencies(generator) {
  let projnameParamCase = paramCase(generator.props.projname);
  var newprojLocation = path.join(process.cwd(), projnameParamCase)
  fs.mkdirSync(newprojLocation)
  //change the working directory before install so that npm will find the package.json file created and add node modules in correct location
  process.chdir(newprojLocation);
  generator.npmInstall(["body-parser", "compression", "dotenv", "express", "dotenv-display", "swagger-ui-express", "object-path", "express-http-proxy", "cors","request"], { save: true })
  generator.npmInstall(["@types/express", "@types/node", "chai", "mocha", "sinon", "@types/sinon", "@types/mocha", "chalk"], { "save-dev": true })
}