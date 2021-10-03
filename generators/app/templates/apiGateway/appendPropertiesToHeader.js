import { IRouteAppendToHeaderConfig } from "./IRoutesConfig";
import * as objectPath from "object-path";
/* istanbul ignore file */
export function appendPropertiesToHeader(appendToHeaderProps: IRouteAppendToHeaderConfig[]) {
    return (proxyReqOpts, srcReq) => {
        //set the default content type to json if not defined otherwise
        let headersList = Object.keys(proxyReqOpts.headers)
        if (!headersList.includes("Content-Type") && !headersList.includes("content-type")) {
            proxyReqOpts.headers['Content-Type'] = 'application/json';
        }
        //append header props
        if (appendToHeaderProps) {
            appendToHeaderProps.forEach(prop => {
                if (prop.reqPath && prop.headerKey) {
                    let propValue = objectPath.get(srcReq, prop.reqPath);
                    if (propValue) {
                        proxyReqOpts.headers[prop.headerKey] = propValue
                    }
                }
            })
        }
        return proxyReqOpts;
    }
}