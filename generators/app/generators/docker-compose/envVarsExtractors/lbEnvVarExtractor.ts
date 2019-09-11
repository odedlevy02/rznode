import { IEnvExtractor } from "./IEnvExtractor";
import { existsSync, readFileSync, } from "fs";
export class LbEnvVarsExtractor implements IEnvExtractor {
    private getEnvContent(dir):string {
        let envContent = null;
        if (existsSync(`${dir}/config/.env`)) {
            envContent = readFileSync(`${dir}/config/.env`)
        }
        return envContent;
    }
    
    getEnvVarsList(dir):string[] {
        let environment = [];
        let envContent = this.getEnvContent(dir);
        if (envContent) {
            envContent.toString().split("\r\n").forEach(envVar => {
                if(envVar){
                    environment.push(`${envVar}`);
                }
                
            });
        }
        return environment;
    }
    getPort(dir: any): string {
       let port = null;
        if(existsSync(`${dir}/server/config.json`)){
            let configStr = readFileSync(`./${dir}/server/config.json`);
            if(configStr){
                try{
                    let config = JSON.parse(configStr.toString());
                    port = config.port;
                }catch(err){
                    console.warn(`could not parse ./${dir}/server/config.json`)
                }
            }
        }
        return port;
    }


}