import * as Generator from "yeoman-generator"
import * as path from "path"
import * as fs from "fs"
const chalk = require('chalk');
const yosay = require('yosay');
//camelCase: someParamName, pascalCase: SomeParamName, paramCase: some-param-name, snakeCase: some_param_name
import { camelCase, paramCase, pascalCase, sentenceCase, snakeCase } from 'change-case'
import { generateClientDockerFile } from "./generators/client-docker.generator";
import { generateCounter } from "./generators/counter.generator";
import { generateUnitTest } from "./generators/unittest.generator";
import { generateModule } from "./generators/module.generator";
import { generateNodeFiles } from "./generators/node.generator";

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    const prompts = [
      {
        type: 'list',
        name: 'gentype',
        message: 'What would you like to generate',
        choices: [
          { name: "New Node service", value: "nodeservice" },
          { name: "New Module (router and service)", value: "module" },
          { name: "Unit test", value: "unittest" },
          { name: "Prometheus counter", value: "counter" },
          { name: "Client Dockerfile", value: "clientDocker" }
        ]
      }, {
        when: (response => {
          return response.gentype == "nodeservice"
        }),
        type: "input",
        name: "projname",
        message: "What is the name of your new node service?"
      }, {
        when: (response => {
          return response.gentype == "module"
        }),
        type: "input",
        name: "modulename",
        message: "What is name of the new module?"
      }, {
        when: (response => {
          return response.gentype == "unittest"
        }),
        type: "input",
        name: "testname",
        message: "What is the test name?"
      }, {
        when: (response => {
          return response.gentype == "counter"
        }),
        type: "input",
        name: "counterName",
        message: "What is the counter name?"
      }, {
        when: (response => {
          return response.gentype == "clientDocker"
        }),
        type: "input",
        name: "clientProjName",
        message: "What is the name of your client project?"
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      (<any>this).props = props;
    });
  }

  writing() {
    switch ((<any>this).props.gentype) {
      case "nodeservice":
        generateNodeFiles(this);
        break;
      case "module":
        generateModule(this);
        break;
      case "unittest":
        generateUnitTest(this);
        break;
      case "counter":
        generateCounter(this);
        break;
      case "clientDocker":
        generateClientDockerFile(this);
        break;
    }

  }

  // _getProjNameLower() {
  //   return camelCase((<any>this).props.projname);
  // }

  // _generateNodeFiles() {
  //   let projnameLower = this._getProjNameLower()
  //   let projnameParamCase = paramCase(projnameLower)
  //   this.fs.copy(
  //     this.templatePath(`index.js`),
  //     this.destinationPath(`${projnameLower}/index.ts`));
  //   this.fs.copy(
  //     this.templatePath(`server.js`),
  //     this.destinationPath(`${projnameLower}/server.ts`));
  //   this.fs.copy(
  //     this.templatePath(`_tsconfig.json`),
  //     this.destinationPath(`${projnameLower}/tsconfig.json`));
  //   this.fs.copy(
  //     this.templatePath(`.env`),
  //     this.destinationPath(`${projnameLower}/config/.env`));
  //   this.fs.copyTpl(
  //     this.templatePath(`Dockerfile`),
  //     this.destinationPath(`${projnameLower}/Dockerfile`), {
  //     projnameLower
  //   });
  //   this.fs.copyTpl(
  //     this.templatePath(`Jenkinsfile`),
  //     this.destinationPath(`${projnameLower}/Jenkinsfile`), {
  //     projnameLower, projnameParamCase
  //   });
  //   this.fs.copyTpl(
  //     this.templatePath(`k8s-deploy.yaml`),
  //     this.destinationPath(`${projnameLower}/${projnameParamCase}-k8s-deploy.yaml`), {
  //     projnameParamCase
  //   });
  //   this.fs.copy(
  //     this.templatePath(`.dockerignore`),
  //     this.destinationPath(`${projnameLower}/.dockerignore`));
  //   this.fs.copyTpl(
  //     this.templatePath(`_swagger.json`),
  //     this.destinationPath(`${projnameLower}/swagger.json`), {
  //     header: sentenceCase(projnameLower)
  //   });
  //   this.fs.copyTpl(
  //     this.templatePath(`_package.json`),
  //     this.destinationPath(`${projnameLower}/package.json`), {
  //     projnameLower
  //   });
  // }

  // _installDepencies() {

  //   let projnameLower = this._getProjNameLower()
  //   var newprojLocation = path.join(process.cwd(), projnameLower)
  //   fs.mkdirSync(newprojLocation)
  //   //change the working directory before install so that npm will find the package.json file created and add node modules in correct location
  //   process.chdir(newprojLocation);
  //   this.npmInstall(["body-parser", "compression", "dotenv", "express", "dotenv-display", "swagger-ui-express"], { save: true })
  //   this.npmInstall(["@types/dotenv", "@types/express", "@types/node", "chai", "mocha", "sinon", "@types/mocha"], { "save-dev": true })
  // }

  
};
