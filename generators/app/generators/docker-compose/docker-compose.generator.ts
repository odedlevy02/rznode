import { readdirSync, existsSync, writeFileSync, appendFileSync, readFileSync, fstat } from "fs";
import * as YAML from "json2yaml";
import { getEnvVarExtractor } from "./envVarsExtractors/envVarExtractorFactory";

const getDirectories = (source) => {
  return readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
}

function getDockerServices() {
  let dirs = getDirectories(".")
  let dockerDirs = dirs.filter(dir => existsSync(`${dir}/Dockerfile`));
  console.log(JSON.stringify(dockerDirs));
  return dockerDirs;
}



const portReplace:{from:string,to:string}[]=[]

function buildJsonContent() {
  let dockerDirs = getDockerServices();
  let dockerCompose: any = {}
  dockerCompose.version = "3";
  let services: any = {}
  dockerCompose.services = services;
  dockerDirs.forEach(dir => {
    let service: any = {}
    services[dir] = service;
    service.build = {
      context: `./${dir}`
    }
    service.image = `\${repository}/${dir}:latest`
    let envExtractor = getEnvVarExtractor(dir);
    
    let environment = envExtractor.getEnvVarsList(dir);
    if (environment.length > 0) {
      service.environment = environment;
    }
    let port = envExtractor.getPort(dir);
    if (port) {
      service.ports = [];
      service.ports.push(`${port}:${port}`)
      portReplace.push({from:`localhost:${port}`,to:`${dir}:${port}`})
    }
  });
  return dockerCompose;
}

function replaceLocalHostLink(dockerComposeJson){
  Object.keys(dockerComposeJson.services).forEach(service=>{
    if(dockerComposeJson.services[service].environment){
      for(let envIndex=0;envIndex<dockerComposeJson.services[service].environment.length;envIndex++){
        let origEnvVar = dockerComposeJson.services[service].environment[envIndex];
        portReplace.forEach(portReplace=>{
          let updated = origEnvVar.replace(portReplace.from,portReplace.to);
          if(updated!=origEnvVar){
            dockerComposeJson.services[service].environment[envIndex] = updated;
          }
        });
      }
    }
  })
}

let dockerComposeJson = buildJsonContent();
replaceLocalHostLink(dockerComposeJson);
console.log(JSON.stringify(dockerComposeJson, null, 2));
let dockerComposeYaml = YAML.stringify(dockerComposeJson);
writeFileSync("docker-compose.yaml",dockerComposeYaml);



