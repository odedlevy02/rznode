const chalk = require('chalk');
import { camelCase, paramCase, pascalCase, sentenceCase, snakeCase } from 'change-case'
export function generateCounter(generator) {
    installCounterDepencies(generator);
    let counterName = camelCase((<any>generator).props.counterName);
    let counterSnake = snakeCase(counterName);
    let counterSentence = sentenceCase(counterName);
    generator.fs.copyTpl(
      generator.templatePath(`counter.js`),
      generator.destinationPath(`counter.ts`), {
      counterName, counterSnake, counterSentence
    });
    generator.log(chalk.blue("For express counters add to server js:"));
    generator.log(chalk.green(`import * as promBundle from "express-prom-bundle";`));
    generator.log(chalk.blue("and in constructor add:"));
    generator.log(chalk.green(`let metricMiddleware = promBundle({includeMethod:true,includePath:true});`));
    generator.log(chalk.green(`generator.app.use(metricMiddleware);`));
  }

  function installCounterDepencies(generator) {
    generator.npmInstall(["prom-client", "express-prom-bundle"], { save: true });
  }