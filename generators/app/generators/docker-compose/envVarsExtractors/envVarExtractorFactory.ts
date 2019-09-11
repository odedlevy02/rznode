import { IEnvExtractor } from "./IEnvExtractor";
import { existsSync, readFileSync, } from "fs";
import { NodeEnvVarsExtractor } from "./nodeEnvVarsExtractor";
import { LbEnvVarsExtractor } from "./lbEnvVarExtractor";

export function getEnvVarExtractor(dir):IEnvExtractor{
    if (existsSync(`${dir}/.env`)) {
        return new NodeEnvVarsExtractor();
    }else if(existsSync(`${dir}/server/config.json`)){
        return new LbEnvVarsExtractor();
    }else{
        throw new Error(`service in folder ${dir} is not recognized as node or loopback service`)
    }
    
}