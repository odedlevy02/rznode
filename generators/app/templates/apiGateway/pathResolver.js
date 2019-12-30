import { IRouteAppendToQueryConfig } from "./IRoutesConfig";

export function pathResolver(targetPath, propsAppend: IRouteAppendToQueryConfig[]) {
    return (req) => {
        let baseUrl = req.url; //by default return the url as is
        if (targetPath) { //if a target path is defined - then use it
            baseUrl = targetPath;
        }
        if (propsAppend) { //if append query params - then append to the url
            baseUrl = this.appendPropertiesToQueryParams(baseUrl, req, propsAppend)
        }
        return baseUrl;
    }
}