//camelCase: someParamName, pascalCase: SomeParamName, paramCase: some-param-name, snakeCase: some_param_name
import { camelCase, paramCase, pascalCase, sentenceCase, snakeCase } from 'change-case'
import * as path from "path"
import * as fs from "fs"
export function generateNodeFiles(generator){
    let projnameLower = camelCase(generator.props.projname);
    let projnameParamCase = paramCase(projnameLower);
    generator.fs.copy(
      generator.templatePath(`index.js`),
      generator.destinationPath(`${projnameLower}/index.ts`));
    generator.fs.copy(
      generator.templatePath(`server.js`),
      generator.destinationPath(`${projnameLower}/server.ts`));
    generator.fs.copy(
      generator.templatePath(`_tsconfig.json`),
      generator.destinationPath(`${projnameLower}/tsconfig.json`));
    generator.fs.copy(
      generator.templatePath(`.env`),
      generator.destinationPath(`${projnameLower}/.env`));
    generator.fs.copyTpl(
      generator.templatePath(`Dockerfile`),
      generator.destinationPath(`${projnameLower}/Dockerfile`), {
      projnameLower
    });
    generator.fs.copyTpl(
      generator.templatePath(`Jenkinsfile`),
      generator.destinationPath(`${projnameLower}/Jenkinsfile`), {
      projnameLower, projnameParamCase
    });
    generator.fs.copyTpl(
      generator.templatePath(`k8s-deploy.yaml`),
      generator.destinationPath(`${projnameLower}/${projnameParamCase}-k8s-deploy.yaml`), {
      projnameParamCase
    });
    generator.fs.copy(
      generator.templatePath(`.dockerignore`),
      generator.destinationPath(`${projnameLower}/.dockerignore`));
    generator.fs.copyTpl(
      generator.templatePath(`_swagger.json`),
      generator.destinationPath(`${projnameLower}/swagger.json`), {
      header: sentenceCase(projnameLower)
    });
    generator.fs.copyTpl(
      generator.templatePath(`_package.json`),
      generator.destinationPath(`${projnameLower}/package.json`), {
      projnameLower
    });

    installDependencies(generator);
}

function installDependencies(generator) {
    let projnameLower = camelCase(generator.props.projname);
    var newprojLocation = path.join(process.cwd(), projnameLower)
    fs.mkdirSync(newprojLocation)
    //change the working directory before install so that npm will find the package.json file created and add node modules in correct location
    process.chdir(newprojLocation);
    generator.npmInstall(["body-parser", "compression", "dotenv", "express", "dotenv-display", "swagger-ui-express"], { save: true })
    generator.npmInstall(["@types/dotenv", "@types/express", "@types/node", "chai", "mocha", "sinon","@types/sinon", "@types/mocha"], { "save-dev": true })
  }