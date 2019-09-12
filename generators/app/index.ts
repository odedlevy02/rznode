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
import { generateDockerCompose } from "./generators/docker-compose/docker-compose.generator";

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
          { name: "Create Docker Compose file", value: "dockerCompose" },
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
      }, 
      {
        when: (response => {
          return response.gentype == "dockerCompose"
        }),
        type: "confirm",
        name: "confirm",
        message: "Make sure to run from your root directory containing a folder for servers and client apps. Continue?"
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
      case "dockerCompose":
        generateDockerCompose();
        break;
    }

  }

 
};
