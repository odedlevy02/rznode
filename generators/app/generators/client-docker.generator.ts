
import * as path from "path";
export function generateClientDockerFile(generator) {
    let clientProjName = path.basename(__dirname);
    generator.fs.copyTpl(
        generator.templatePath(`client.Dockerfile`),
        generator.destinationPath(`Dockerfile`), {
        clientProjName
    });
    generator.fs.copy(
        generator.templatePath(`.dockerignore`),
        generator.destinationPath(`.dockerignore`));
    generator.fs.copy(
        generator.templatePath(`client.nginx.conf`),
        generator.destinationPath(`nginx.conf`)
    );
  }