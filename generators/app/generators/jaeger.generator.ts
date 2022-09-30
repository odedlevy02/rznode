import chalk from 'chalk';
import { camelCase, paramCase, pascalCase, sentenceCase, snakeCase } from 'change-case'
import * as path from "path";
import * as Generator from "yeoman-generator"
export function generateJaeger(generator:Generator) {
    const serviceName= path.basename(generator.destinationRoot())
    generator.fs.copyTpl(
        generator.templatePath(`jaeger/tracing.js`),
        generator.destinationPath(`helpers/tracing.ts`),
        {}
    );

    addJaegerRefToIndex(generator,serviceName)
    installDependencies(generator)
}

function addJaegerRefToIndex(generator:Generator,serviceName){
    const file = generator.fs.read("index.ts")
    const splitContent = file.split("\n")
    const addedContent = [
        `import { Tracer } from "./helpers/tracing";`,
        `new Tracer().init("${serviceName}")`
    ]
    const joinedContent = [...addedContent,...splitContent]
    const updatedContent = joinedContent.join("\n")
    generator.fs.delete("index.ts")
    generator.fs.commit(() => { })
    generator.fs.write("index.ts", updatedContent)
    generator.log(chalk.green("Make sure to add env variable 'JAEGER_TRACE_URL' with path to jaeger."))
    generator.log(chalk.green("Default jaeger is set to: http://localhost:14268/api/traces"))
}


function installDependencies(generator) {
    
    generator.npmInstall([
        "@opentelemetry/sdk-trace-node",
        "@opentelemetry/instrumentation",
        "@opentelemetry/sdk-trace-base",
        "@opentelemetry/exporter-jaeger",
        "opentelemetry-instrumentation-express",
        "@opentelemetry/resources",
        "@opentelemetry/semantic-conventions"

    ], { save: true })
  }