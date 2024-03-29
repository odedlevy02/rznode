import * as Generator from "yeoman-generator"
import { generateClientDockerFile } from "./generators/client-docker.generator";
import { generateCounter } from "./generators/counter.generator";
import { generateUnitTest } from "./generators/unittest.generator";
import { generateModule } from "./generators/module.generator";
import { generateNodeFiles } from "./generators/node.generator";
import { generateDockerCompose } from "./generators/docker-compose/docker-compose.generator";
import { generateApiGatewayServer } from "./generators/api-gateway.generator";
import { buildPackageJsonScripts } from "./generators/global-package-json.generator";
import { generateSwagger } from "./generators/swagger.generator";
import { generateHelmCharts } from "./generators/helmCharts.generator";
import { generateJaeger } from "./generators/jaeger.generator";

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
          { name: "New Api Gateway service", value: "apigatewayservice" },
          { name: "New Module (router and service)", value: "module" },
          { name: "Unit test", value: "unittest" },
          { name: "Global package json scripts", value: "globalPackageJson" },
          { name: "Generate swagger in Api Gateway", value: "swaggerGenerator" },
          { name: "Prometheus counter", value: "counter" },
          { name: "Create Docker Compose file", value: "dockerCompose" },
          { name: "Client Dockerfile", value: "clientDocker" },
          { name: "Helm charts", value: "helmcharts" },
          { name: "Jaeger support", value: "jaeger" }
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
          return response.gentype == "nodeservice"
        }),
        type: "input",
        name: "includeTypeorm",
        message: "Do you want to add typeorm? [y/n]"
      },
      {
        when: (response => {
          return response.gentype == "apigatewayservice"
        }),
        type: "input",
        name: "projname",
        message: "What is the name of your new api gateway service?"
      }, {
        when: (response => {
          return response.gentype == "module"
        }),
        type: "input",
        name: "modulename",
        message: "What is name of the new module?"
      }, {
        when: (response => {
          return response.gentype == "module"
        }),
        type: "input",
        name: "entityName",
        message: "Do you want a crud module based on an entity? [Insert entity name or leave empty]"
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
      },
      {
        when: (response => {
          return response.gentype == "globalPackageJson"
        }),
        type: "confirm",
        name: "confirmGlobalPackageJson",
        message: "This feature will overwrite your global package.json scripts content. Do you want to continue?"
      },
      {
        when: (response => {
          return response.gentype == "helmcharts"
        }),
        type: "input",
        name: "projectName",
        message: "What project name (will replace to lower with '-' as separator)?"
      }

    ];

    return this.prompt(prompts).then(props => {
      // props is of type: {gentType:"string","someConfirm":boolean}
      (<any>this).props = props;
      //console.log(props)
    });
  }

  writing() {
    switch ((<any>this).props.gentype) {
      case "nodeservice":
        generateNodeFiles(this);
        break;
      case "apigatewayservice":
        generateApiGatewayServer(this);
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
      case "globalPackageJson":
        if ((<any>this).props.confirmGlobalPackageJson) {
          buildPackageJsonScripts();
        }
        break;
      case "swaggerGenerator":
        generateSwagger(this.destinationRoot());
        break;
      case "helmcharts":
        generateHelmCharts(this);
        break;
      case "jaeger":
        generateJaeger(this);
        break;
    }

  }


};
