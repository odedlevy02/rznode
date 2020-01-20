import { IRouteAppendToQueryConfig } from "./IRoutesConfig";
import { appendPropertiesToQueryParams } from "./appendPropertiesToQuery";

export function pathResolver(targetPath, propsAppend: IRouteAppendToQueryConfig[]) {
    return (req) => {
        let baseUrl = req.url; //by default return the url as is
        if (targetPath) { //if a target path is defined - then use it after appending the query params
            let baseWithQuery =baseUrl.split("?")
            baseUrl = targetPath;
            if(baseWithQuery.length>1){
                baseUrl = `${baseUrl}?${baseWithQuery[1]}`
            }
        }
        if (propsAppend) { //if append query params - then append to the url
            baseUrl = appendPropertiesToQueryParams(baseUrl, req, propsAppend)
        }
        return baseUrl;
    }
}