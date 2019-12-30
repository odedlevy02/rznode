import * as proxy from "express-http-proxy";
import * as express from "express";
import { IRoutesConfig, IHostConfig, IRouteAppendToBodyConfig, ISingleRouteConfig, IRouteAppendToQueryConfig, IRouteAppendToHeaderConfig } from "./IRoutesConfig";
import * as objectPath from "object-path";
import * as chalk from "chalk";
import * as origRequest from "request";
import { pathResolver } from "./pathResolver";
import { appendPropertiesToBody } from "./appendPropertiesToBody";
import { getUploadFileProxyMethod } from "./uploadFileProxyMethod";
import { appendPropertiesToHeader } from "./appendPropertiesToHeader";

export class ApiGatewayRouteBuilder {
    constructor(
        private config: IRoutesConfig,
        private app: express.Application
    ) { }

    //main method. Will receive a routes config and will iterate over all its routes
    //Will then create an express route, append middleware and set the default options that will enable
    //to catch errors, append properties and resolve paths
    setRoutesFromConfig() {
        //iterate over each host and in it iterate over each route and build the route
        this.config && this.config.hosts && this.config.hosts.forEach(host => {
            console.log(chalk.cyanBright(`Host ${host.host} routes:`))
            host.routes && host.routes.forEach(route => {
                this.buildSingleRoute(host, route)
            })
        })
    }
    buildSingleRoute(host: IHostConfig, route: ISingleRouteConfig) {
        let method = this.getPathMethod(route.method);
        let middlewareList = this.getMiddlewaresInRoutes(host, route);
        let proxyMethod = this.getProxyMethod(host, route)
        if (middlewareList && middlewareList.length > 0) {
            this.app[method](route.source, ...middlewareList, proxyMethod)
        } else {
            this.app[method](route.source, proxyMethod)
        }
        let routeTarget = route.target ? route.target : route.source;
        console.log(chalk.green(`   [${method}] ${route.source} -> ${host.host}${routeTarget}`))
    }

    //default route method (verb) is get. Validate that method set is one of the following
    getPathMethod(method): string {
        if (method && ["get", "post", "put", "patch", "delete"].includes(method)) {
            return method
        } else {
            return "get"
        }
    }

    //Middleware can be defined per each path in route or in the entire route
    //if defined in path - even when empty array - return path middleware
    //if not in path and in route - return that
    //otherwise return empty
    private getMiddlewaresInRoutes(host: IHostConfig, route: ISingleRouteConfig) {
        if (route.middlewares) {
            return route.middlewares
        } else if (host.middlewares) {
            return host.middlewares
        } else {
            return null;
        }
    }

    //uses express http proxy or in special cases uses a different proxy for file uploads
    getProxyMethod(host: IHostConfig, route: ISingleRouteConfig) {
        if (route.isFileUpload) {
            return getUploadFileProxyMethod(host, route);
        } else {
            return proxy(host.host, this.getGeneralOptions(route.target, route.appendToBody, route.appendToQuery, route.appendToHeader))
        }
    }

    getGeneralOptions(targetPath, appendToBodyProps: IRouteAppendToBodyConfig[], appendToQueryProps: IRouteAppendToQueryConfig[], appendToHeaderProps: IRouteAppendToHeaderConfig[]) {
        return {
            proxyReqPathResolver: pathResolver(targetPath, appendToQueryProps), //needed in order to return the original path
            proxyReqBodyDecorator: appendPropertiesToBody(appendToBodyProps), //returns a method. Receives a list of required fields to append and will append to body
            proxyReqOptDecorator: appendPropertiesToHeader(appendToHeaderProps), //set the default content-type header to application/json so that it will be possible to append properties to body in cases such as route/:id/some where only path param is passed
            userResDecorator: this.responseDecoratorErrorLogger, //log 500 errors received from routed to servers
            proxyErrorHandler: this.generalErrorHandler //handle errors that occur prior to routing to servers
        }
    }


    generalErrorHandler(err, res, next) {
        console.log("Error in server: ", err)
        next(err);
    }

    responseDecoratorErrorLogger(proxyRes, proxyResData, userReq, userRes) {
        if (proxyRes.statusCode == 500) {
            let data = proxyResData.toString('utf8');
            console.log("Error returned from server: " + data)
        } else if (proxyRes.statusCode == 404) {
            console.log(`ApiGatwayService.responseErrorLogger - the url: [${userReq.method}] ${userReq.originalUrl} was not found`);
        }
        return proxyResData;
    }
}