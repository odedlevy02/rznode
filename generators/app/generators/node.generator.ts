//camelCase: someParamName, pascalCase: SomeParamName, paramCase: some-param-name, snakeCase: some_param_name
import { camelCase, paramCase, pascalCase, sentenceCase, snakeCase } from 'change-case'
import * as path from "path"
import * as fs from "fs"
export function generateNodeFiles(generator) {
  let projnameParamCase = paramCase(generator.props.projname);
  generator.fs.copy(
    generator.templatePath(`index.js`),
    generator.destinationPath(`${projnameParamCase}/index.ts`));
  generator.fs.copy(
    generator.templatePath(`server.js`),
    generator.destinationPath(`${projnameParamCase}/server.ts`));
  generator.fs.copy(
    generator.templatePath(`serviceErrorReducer.js`),
    generator.destinationPath(`${projnameParamCase}/helpers/serviceErrorReducer.ts`));
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
    generator.templatePath(`_swagger.json`),
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
  generator.npmInstall(["body-parser", "compression", "dotenv", "express", "dotenv-display", "swagger-ui-express"], { save: true })
  generator.npmInstall(["@types/express", "@types/node", "chai", "mocha", "sinon", "@types/sinon", "@types/mocha"], { "save-dev": true })
}