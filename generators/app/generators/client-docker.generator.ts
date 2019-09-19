
import * as path from "path";
export function generateClientDockerFile(generator) {
    let clientProjPath = generator.destinationRoot();
    let clientProjName = getFolderName(clientProjPath);
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

  function getFolderName(fullPath){
      if(fullPath.includes("/")){
          return fullPath.substring(fullPath.lastIndexOf('/')+1);
      }else{
        return fullPath.substring(fullPath.lastIndexOf('\\')+1);
      }
  }