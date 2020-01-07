import { IRouteAppendToQueryConfig } from "./IRoutesConfig";
import * as objectPath from "object-path";

//when required append a set of params to the query params list
export function appendPropertiesToQueryParams(baseUrl: string, req, propsAppend: IRouteAppendToQueryConfig[]) {
    if (propsAppend) {
        //create an array of prop=value from request and propAppend 
        let appendStrings = createPropArrayFromAppendData(req, propsAppend)
        baseUrl = appendQueryParamsToUrl(baseUrl, appendStrings);
    }
    return baseUrl;
}

function appendOrigQueryParams(baseUrl, originalUrl) {
    //split orig url after ? and append to baseUrl
    let origParts = originalUrl.split("?")
    if (origParts.length > 1) {
        baseUrl = `${baseUrl}?${origParts[1]}`
    }
    return baseUrl;
}

//creates an array of key=value from the list of required appended properties
function createPropArrayFromAppendData(req, propsAppend: IRouteAppendToQueryConfig[]) {
    let appendStrings = []
    propsAppend.forEach(prop => {
        if (prop.reqPath && prop.queryParamName) {
            let propValue = objectPath.get(req, prop.reqPath);
            if (prop.appendToArray) {
                propValue = [propValue]
            }
            appendStrings.push(`${prop.queryParamName}=${JSON.stringify(propValue)}`)
        }
    })
    return appendStrings;
}

//receive list of key=values and appends to the url
function appendQueryParamsToUrl(baseUrl: string, params: string[]): string {
    if (params.length > 0) {
        let queryString = params.join("&")
        if (baseUrl.includes("?")) {
            baseUrl += `&${queryString}`
        } else {
            baseUrl += `?${queryString}`
        }
    }
    return baseUrl;
}