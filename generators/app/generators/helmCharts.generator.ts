import chalk from 'chalk';
import { camelCase, paramCase, pascalCase, sentenceCase, snakeCase } from 'change-case'

export function generateHelmCharts(generator) {
    const projectName = generator["props"].projectName;
    const projectNameHyphen = paramCase(projectName)
    const projectNameUnderscore = snakeCase(projectName)
    generator.log(chalk.green(`hyp: ${projectNameHyphen}, under: ${projectNameUnderscore}`));
    const baseHelmFolderName = "helm"
    generator.fs.copyTpl(
        generator.templatePath(`helmCharts/Chart.yaml`),
        generator.destinationPath(`${baseHelmFolderName}/Chart.yaml`), {
        projectNameHyphen,projectNameUnderscore
    });
    generator.fs.copyTpl(
        generator.templatePath(`helmCharts/values.yaml`),
        generator.destinationPath(`${baseHelmFolderName}/values.yaml`), {
        projectNameHyphen,projectNameUnderscore
    });
    generator.fs.copyTpl(
        generator.templatePath(`helmCharts/templates/_helpers.tpl`),
        generator.destinationPath(`${baseHelmFolderName}/templates/_helpers.tpl`), {
        projectNameHyphen,projectNameUnderscore
    });
    generator.fs.copyTpl(
        generator.templatePath(`helmCharts/templates/configmap.yaml`),
        generator.destinationPath(`${baseHelmFolderName}/templates/configmap.yaml`), {
        projectNameHyphen,projectNameUnderscore
    });
    generator.fs.copyTpl(
        generator.templatePath(`helmCharts/templates/deployment.yaml`),
        generator.destinationPath(`${baseHelmFolderName}/templates/deployment.yaml`), {
        projectNameHyphen,projectNameUnderscore
    });
    generator.fs.copyTpl(
        generator.templatePath(`helmCharts/templates/dns-record-eternal-svc.yaml`),
        generator.destinationPath(`${baseHelmFolderName}/templates/dns-record-eternal-svc.yaml`), {
        projectNameHyphen,projectNameUnderscore
    });
    generator.fs.copyTpl(
        generator.templatePath(`helmCharts/templates/hpa.yaml`),
        generator.destinationPath(`${baseHelmFolderName}/templates/hpa.yaml`), {
        projectNameHyphen,projectNameUnderscore
    });
    generator.fs.copyTpl(
        generator.templatePath(`helmCharts/templates/ingress.yaml`),
        generator.destinationPath(`${baseHelmFolderName}/templates/ingress.yaml`), {
        projectNameHyphen,projectNameUnderscore
    });
    generator.fs.copyTpl(
        generator.templatePath(`helmCharts/templates/secrets.yaml`),
        generator.destinationPath(`${baseHelmFolderName}/templates/secrets.yaml`), {
        projectNameHyphen,projectNameUnderscore
    });
    generator.fs.copyTpl(
        generator.templatePath(`helmCharts/templates/service.yaml`),
        generator.destinationPath(`${baseHelmFolderName}/templates/service.yaml`), {
        projectNameHyphen,projectNameUnderscore
    });
    generator.fs.copyTpl(
        generator.templatePath(`helmCharts/templates/serviceaccount.yaml`),
        generator.destinationPath(`${baseHelmFolderName}/templates/serviceaccount.yaml`), {
        projectNameHyphen,projectNameUnderscore
    });
    generator.fs.copyTpl(
        generator.templatePath(`helmCharts/configuration/prod/env.hcl`),
        generator.destinationPath(`${baseHelmFolderName}/configuration/prod/env.hcl`), {
        projectNameHyphen,projectNameUnderscore
    });
    generator.fs.copyTpl(
        generator.templatePath(`helmCharts/configuration/prod/values.yaml`),
        generator.destinationPath(`${baseHelmFolderName}/configuration/prod/values.yaml`), {
        projectNameHyphen,projectNameUnderscore
    });
    generator.fs.copyTpl(
        generator.templatePath(`helmCharts/configuration/staging/env.hcl`),
        generator.destinationPath(`${baseHelmFolderName}/configuration/staging/env.hcl`), {
        projectNameHyphen,projectNameUnderscore
    });
    generator.fs.copyTpl(
        generator.templatePath(`helmCharts/configuration/staging/values.yaml`),
        generator.destinationPath(`${baseHelmFolderName}/configuration/staging/values.yaml`), {
        projectNameHyphen,projectNameUnderscore
    });
}