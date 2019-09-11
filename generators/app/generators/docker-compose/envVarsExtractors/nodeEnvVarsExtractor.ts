import { existsSync, readFileSync, } from "fs";
import { IEnvExtractor } from "./IEnvExtractor";
export class NodeEnvVarsExtractor implements IEnvExtractor {
    private getEnvContent(dir):string {
        let envContent = null;
        if (existsSync(`${dir}/.env`)) {
            envContent = readFileSync(`${dir}/.env`)
        }
        return envContent;
    }

    getPort(dir) {
        let port = null;
        let envContent = this.getEnvContent(dir);
        if (envContent) {
          envContent.toString().split("\r\n").forEach(envVar => {
            if (envVar.includes("PORT")) {
              let portVars = envVar.split("=");
              if (portVars.length > 1) {
                port = portVars[1];
              }
            }
          })
        }
        return port;
      }

    getEnvVarsList(dir):string[] {
        let environment = [];
        let envContent = this.getEnvContent(dir);
        if (envContent) {
            envContent.toString().split("\r\n").forEach(envVar => {
                environment.push(`${envVar}`);
            });
        }
        return environment;
    }
}