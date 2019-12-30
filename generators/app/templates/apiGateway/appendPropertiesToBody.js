import { IRouteAppendToBodyConfig } from "./IRoutesConfig";
import * as objectPath from "object-path";
//when requested will append additional data to the body of the request
export function appendPropertiesToBody(propsAppend: IRouteAppendToBodyConfig[]) {
    //return the method expected by proxyReqBodyDecorator yet now has access to propsAppend
    return (bodyContent, srcReq) => {
        if (propsAppend) {
            propsAppend.forEach(prop => {
                if (prop.reqPath && prop.bodyPath) {
                    let propValue = objectPath.get(srcReq, prop.reqPath);
                    if (prop.appendToArray) {
                        objectPath.push(bodyContent, prop.bodyPath, propValue)
                    } else {
                        objectPath.set(bodyContent, prop.bodyPath, propValue)
                    }
                }
            })
        }
        return bodyContent;
    }
}