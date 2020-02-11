import { IHostConfig, ISingleRouteConfig } from "./IRoutesConfig";
import * as objectPath from "object-path";
import * as origRequest from "request";

//special scenario for uploading files and needing to stream them
//in this case using request and not http express proxy since it does not work
export function getUploadFileProxyMethod(host: IHostConfig, route: ISingleRouteConfig) {
    return (req, res) => {
        //append header props to header object
        let headers = <any>{}
        if (route.appendToHeader) {
            route.appendToHeader.forEach(prop => {
                if (prop.reqPath && prop.headerKey) {
                    let propValue = objectPath.get(req, prop.reqPath);
                    headers[prop.headerKey] = propValue
                }
            })
        }
        //build url from route
        let url = route.target ? `${host.host}${route.target}` : `${host.host}${route.source}`
        //pipe request to new url after appending headers
        let pipeRes = req.pipe(origRequest({ url, headers }))
        pipeRes.on('error', function (err) {
            console.error(`getUploadFileProxyMethod: error while piping file upload request, Error message: ${err.message}`)
        })

        pipeRes.pipe(res)
    }
}