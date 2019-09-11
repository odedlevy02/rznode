export interface IEnvExtractor{
    getEnvVarsList(dir):string[]
    getPort(dir):string; 

}