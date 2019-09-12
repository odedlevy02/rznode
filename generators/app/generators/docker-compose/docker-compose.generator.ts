import { readdirSync, existsSync, writeFileSync} from "fs";
import * as YAML from "json2yaml";
import { NodeEnvVarsExtractor } from "./nodeEnvVarsExtractor";
import { camelCase, paramCase, pascalCase, sentenceCase, snakeCase } from 'change-case'

export function generateDockerCompose() {
  let dockerComposeJson = buildJsonContent();
  replaceLocalHostLink(dockerComposeJson);
  //console.log(JSON.stringify(dockerComposeJson, null, 2));
  let dockerComposeYaml = YAML.stringify(dockerComposeJson);
  writeFileSync("docker-compose.yaml", dockerComposeYaml);
  //add an env file with repo set to local host
  let envContent = `#set the container repo path
  CONTAINER_REPO=localhost
  `
  writeFileSync(".env", envContent);
}

const getDirectories = (source) => {
  
  if (existsSync(source)) {
    return readdirSync(source, { withFileTypes: true })
      .filter(dir => dir.isDirectory())
      .map(dir => `${source}/${dir.name}`)
  }else{
    return [];
  }
}

export function getDockerServices(source=".") {
  //get up to 2 levels down
  let dirs = [];
  let rootDirs = getDirectories(source)
  rootDirs.forEach(childDir=>{
    dirs.push(childDir)
    let childDirs = getDirectories(childDir);
    dirs = [...dirs,...childDirs]
  })
  let dockerDirs = dirs.filter(dir => existsSync(`${dir}/Dockerfile`));
  return dockerDirs;
}

const portReplace: { from: string, to: string }[] = []

function buildJsonContent() {
  let dockerDirs = getDockerServices();
  let dockerCompose: any = {version :"3"}
  let services: any = {}
  dockerCompose.services = services;
  dockerDirs.forEach(fullPath => {
    //get the serverName from the fullpath (servers/<serverName>)
    let serverName = fullPath.substring(fullPath.lastIndexOf('/')+1);
    let paramServerName = paramCase(serverName);
    let service: any = {}
    services[serverName] = service;
    service.build = {
      context: `${fullPath}`
    }
    service.image = `\${CONTAINER_REPO}/${paramServerName}:latest`
    let envExtractor = new NodeEnvVarsExtractor();

    let environment = envExtractor.getEnvVarsList(fullPath);
    if (environment.length > 0) {
      service.environment = environment;
    }
    let port = envExtractor.getPort(fullPath);
    if (port) {
      service.ports = [];
      service.ports.push(`${port}:${port}`)
      portReplace.push({ from: `localhost:${port}`, to: `${serverName}:${port}` })
    }
  });
  return dockerCompose;
}

function replaceLocalHostLink(dockerComposeJson) {
  Object.keys(dockerComposeJson.services).forEach(service => {
    if (dockerComposeJson.services[service].environment) {
      for (let envIndex = 0; envIndex < dockerComposeJson.services[service].environment.length; envIndex++) {
        let origEnvVar = dockerComposeJson.services[service].environment[envIndex];
        portReplace.forEach(portReplace => {
          let updated = origEnvVar.replace(portReplace.from, portReplace.to);
          if (updated != origEnvVar) {
            dockerComposeJson.services[service].environment[envIndex] = updated;
          }
        });
      }
    }
  })
}




