//camelCase: someParamName, pascalCase: SomeParamName, paramCase: some-param-name, snakeCase: some_param_name
import { camelCase, paramCase, pascalCase, sentenceCase, snakeCase } from 'change-case'
import * as Generator from "yeoman-generator"
import * as path from "path"
import * as fs from "fs"
import chalk from 'chalk';
export function generateNodeFiles(generator: Generator) {
  let projnameParamCase = paramCase(generator["props"].projname);
  const shouldInstallTypeorm = generator["props"].includeTypeorm?.toUpperCase() == "Y" ? true : false
  if (shouldInstallTypeorm) {
    generator.fs.copy(
      generator.templatePath(`typeorm/index.js`),
      generator.destinationPath(`${projnameParamCase}/index.ts`));
    generator.fs.copy(
      generator.templatePath(`typeorm/rootFolder.js`),
      generator.destinationPath(`${projnameParamCase}/rootFolder.ts`));
    generator.fs.copy(
      generator.templatePath(`typeorm/dbConnectionManager.js`),
      generator.destinationPath(`${projnameParamCase}/dal/dbConnectionManager.ts`));
    generator.fs.copy(
      generator.templatePath(`typeorm/.env`),
      generator.destinationPath(`${projnameParamCase}/.env`));
    generator.fs.copy(
      generator.templatePath(`typeorm/server.js`),
      generator.destinationPath(`${projnameParamCase}/server.ts`));

  } else {
    generator.fs.copy(
      generator.templatePath(`index.js`),
      generator.destinationPath(`${projnameParamCase}/index.ts`));
    generator.fs.copy(
      generator.templatePath(`.env`),
      generator.destinationPath(`${projnameParamCase}/.env`));
    generator.fs.copy(
      generator.templatePath(`server.js`),
      generator.destinationPath(`${projnameParamCase}/server.ts`));
  }


  generator.fs.copy(
    generator.templatePath(`serviceErrorReducer.js`),
    generator.destinationPath(`${projnameParamCase}/helpers/serviceErrorReducer.ts`));
  generator.fs.copy(
    generator.templatePath(`addSupportForLogs.js`),
    generator.destinationPath(`${projnameParamCase}/helpers/addSupportForLogs.ts`));
  generator.fs.copy(
    generator.templatePath(`timerHelper.js`),
    generator.destinationPath(`${projnameParamCase}/helpers/timerHelper.ts`));
  generator.fs.copy(
    generator.templatePath(`_tsconfig.json`),
    generator.destinationPath(`${projnameParamCase}/tsconfig.json`));

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
  if (shouldInstallTypeorm) {
    installTypeorm(generator)
    generator.log(chalk.blue(`Note - for completing the typeorm installation you must install a specific db (pg, mysql etc) and also configure the .env with the DB settings`))
  }
}

function installDependencies(generator) {
  let projnameParamCase = paramCase(generator.props.projname);
  var newprojLocation = path.join(process.cwd(), projnameParamCase)
  fs.mkdirSync(newprojLocation)
  //change the working directory before install so that npm will find the package.json file created and add node modules in correct location
  process.chdir(newprojLocation);
  generator.npmInstall(["compression", "dotenv", "express", "dotenv-display", "swagger-ui-express"], { save: true })
  generator.npmInstall(["@types/express", "@types/node", "chai", "mocha", "sinon", "@types/sinon", "@types/mocha"], { "save-dev": true })
}

function installTypeorm(generator) {
  generator.npmInstall(["typeorm", "reflect-metadata","sqlite3"], { save: true })
}