import * as Generator from "yeoman-generator"
import * as path from "path"
import * as fs from "fs"
const chalk = require('chalk');
const yosay = require('yosay');
//camelCase: someParamName, pascalCase: SomeParamName, paramCase: some-param-name, snakeCase: some_param_name
import { camelCase, paramCase, pascalCase, camel } from 'change-case'

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
          { name: "Add Swagger", value: "swagger" }
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
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      (<any>this).props = props;
    });
  }

  writing() {
    if ((<any>this).props.gentype == "nodeservice") {

      this._generateNodeFiles();
      this._installDepencies();
    } else if ((<any>this).props.gentype == "module") {
      this._generateModule();
    } else if ((<any>this).props.gentype == "unittest") {
      this._generateUnitTest();
      this._installUnitTestDependencies();
    } else if ((<any>this).props.gentype == "swagger") {
      this._generateSwaggerFile();
      this._installSwagggerDependencies();
    }
  }

  _getProjNameLower() {
    return camelCase((<any>this).props.projname);
  }

  _generateNodeFiles() {
    let projnameLower = this._getProjNameLower()
    let projnameParamCase = paramCase(projnameLower)
    this.fs.copy(
      this.templatePath(`index.js`),
      this.destinationPath(`${projnameLower}/index.ts`));
    this.fs.copy(
      this.templatePath(`server.js`),
      this.destinationPath(`${projnameLower}/server.ts`));
    this.fs.copy(
      this.templatePath(`_tsconfig.json`),
      this.destinationPath(`${projnameLower}/tsconfig.json`));
    this.fs.copy(
      this.templatePath(`.env`),
      this.destinationPath(`${projnameLower}/config/.env`));
    this.fs.copyTpl(
      this.templatePath(`Dockerfile`),
      this.destinationPath(`${projnameLower}/Dockerfile`), {
        projnameLower
      });
    this.fs.copyTpl(
      this.templatePath(`Jenkinsfile`),
      this.destinationPath(`${projnameLower}/Jenkinsfile`), {
        projnameLower, projnameParamCase
      });
    this.fs.copyTpl(
      this.templatePath(`k8s-deploy.yaml`),
      this.destinationPath(`${projnameLower}/${projnameParamCase}-k8s-deploy.yaml`), {
        projnameParamCase
      });
    this.fs.copy(
      this.templatePath(`.dockerignore`),
      this.destinationPath(`${projnameLower}/.dockerignore`));
    this.fs.copyTpl(
      this.templatePath(`_package.json`),
      this.destinationPath(`${projnameLower}/package.json`), {
        projnameLower
      });
  }

  _generateModule() {
    let modulename = pascalCase((<any>this).props.modulename); // FirstLetterCapital
    let modulenameLower = camelCase((<any>this).props.modulename) //firstLetterLowerCase
    this.fs.copyTpl(
      this.templatePath(`router.js`),
      this.destinationPath(`${modulenameLower}/${modulenameLower}.router.ts`), {
        modulename, modulenameLower
      });
    this.fs.copyTpl(
      this.templatePath(`service.js`),
      this.destinationPath(`${modulenameLower}/${modulenameLower}.service.ts`), {
        modulename, modulenameLower
      });
  }

  _generateUnitTest() {
    let origTestName = (<any>this).props.testname;
    let testName = origTestName;
    if (!testName.endsWith("test")) {
      testName += "Test"
    }
    this.fs.copyTpl(
      this.templatePath(`unittest.js`),
      this.destinationPath(`test/${testName}.ts`), {
        origTestName
      });

  }

  _generateSwaggerFile() {
    this.fs.copy(
      this.templatePath(`_swagger.json`),
      this.destinationPath(`swagger.json`));
    yosay("yosay done");
    console.log("console done");
  }

  _installDepencies() {

    let projnameLower = this._getProjNameLower()
    var newprojLocation = path.join(process.cwd(), projnameLower)
    fs.mkdirSync(newprojLocation)
    //change the working directory before install so that npm will find the package.json file created and add node modules in correct location
    process.chdir(newprojLocation);
    this.npmInstall(["body-parser", "compression", "dotenv", "express", "dotenv-display"], { save: true })
    this.npmInstall(["@types/dotenv", "@types/express", "@types/node"], { "save-dev": true })
  }

  _installUnitTestDependencies() {
    this.npmInstall(["chai", "mocha", "sinon", "@types/mocha"], { "save-dev": true })
  }

  _installSwagggerDependencies() {
    this.npmInstall(["swagger-ui-express"]);
  }

};
