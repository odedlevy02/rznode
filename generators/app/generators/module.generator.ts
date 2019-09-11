import { camelCase, paramCase, pascalCase, sentenceCase, snakeCase } from 'change-case'
const chalk = require('chalk');
export function generateModule(generator) {
    let modulename = pascalCase(generator.props.modulename); // FirstLetterCapital
    let modulenameLower = camelCase(generator.props.modulename) //firstLetterLowerCase
    generator.fs.copyTpl(
      generator.templatePath(`router.js`),
      generator.destinationPath(`${modulenameLower}/${modulenameLower}.router.ts`), {
      modulename, modulenameLower
    });
    generator.fs.copyTpl(
      generator.templatePath(`service.js`),
      generator.destinationPath(`${modulenameLower}/${modulenameLower}.service.ts`), {
      modulename, modulenameLower
    });
    //Note - add to server.ts method setRoutes:  this.app.use("/ordersManage",ordersManageRouter);
    generator.log(chalk.blue("NOTE - make sure to add to 'server.ts' in method 'setRoutes'"))
    generator.log(chalk.green(`this.app.use("/${modulenameLower}",${modulenameLower}Router)`))
  }