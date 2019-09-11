export function generateClientDockerFile(generator) {
    let clientProjName = generator.props.clientProjName;
    generator.fs.copyTpl(
        generator.templatePath(`client.Dockerfile`),
        generator.destinationPath(`Dockerfile`), {
        clientProjName
    });
    generator.fs.copy(
        generator.templatePath(`client.nginx.conf`),
        generator.destinationPath(`nginx.conf`)
    );
  }