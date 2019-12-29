import * as proxy from "express-http-proxy";
import * as http from "http"
import * as express from "express";
import * as bodyParser from "body-parser"
import * as compression from "compression"
import { IRoutesConfig, IHostConfig, IRouteAppendToBodyConfig, IRouteAppendToQueryConfig, ISingleRouteConfig } from "./dataModels/IRoutesConfig";
import * as objectPath from "object-path";
import * as swaggerUi from "swagger-ui-express"
import * as chalk from "chalk";
import * as cors from "cors"

export class ApiGatewayServer {

    app: express.Application = null;
    port = process.env.PORT || 3000;
    config: IRoutesConfig = null;
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(compression());
        this.app.use(cors())

    }

    public setSwagger = () => {
        let swaggerDocument = require('./swagger.json');
        this.app.use('/explorer', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { "showExplorer": true }));
        console.log(`For exploring the apis open: http://localhost:${this.port}/explorer`)
    }


    public startServer = () => {
        var httpServer = http.createServer(this.app);
        httpServer.listen(this.port);
        httpServer.on('error', this.onError);
        httpServer.on('listening', this.onServerListen);
    }

    //add any custom route 
    setCustomRoutes() {
        //sample
        // this.app.post("/customRoute",(req,res)=>{
        //     res.status(200).send({message:"I am custom"})
        // })
    }

    //main method. Will receive a routes config and will iterate over all its routes
    //Will then create an express route, append middleware and set the default options that will enable
    //to catch errors, append properties and resolve paths
    setRoutesFromConfig(config: IRoutesConfig) {
        this.config = config;
        //iterate over each host and in it iterate over each route and build the route
        config && config.hosts && config.hosts.forEach(host => {
            console.log(chalk.cyanBright(`Host ${host.host} routes:`))
            host.routes && host.routes.forEach(route => {
                this.buildSingleRoute(host, route)
            })
        })
    }

    buildSingleRoute(host: IHostConfig, route: ISingleRouteConfig) {
        let method = this.getPathMethod(route.method);
        let middlewareList = this.getMiddlewaresInRoutes(host, route);
        if (middlewareList && middlewareList.length > 0) {
            this.app[method](route.source, ...middlewareList, proxy(host.host, this.getGeneralOptions(route.target, route.appendToBody,route.appendToQuery)))
        } else {
            this.app[method](route.source, proxy(host.host, this.getGeneralOptions(route.target, route.appendToBody,route.appendToQuery)))
        }
        let routeTarget = route.target?route.target:route.source;
        console.log(chalk.green(`   [${method}] ${route.source} -> ${host.host}${routeTarget}`))
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

    //return the general options for proxy 
    getGeneralOptions(targetPath, appendToBodyProps: IRouteAppendToBodyConfig[],appendToQueryProps: IRouteAppendToQueryConfig[]) {
        return {
            proxyReqPathResolver: this.pathResolver(targetPath,appendToQueryProps), //needed in order to return the original path
            proxyReqBodyDecorator: this.appendPropertiesToBody(appendToBodyProps), //returns a method. Receives a list of required fields to append and will append to body
            userResDecorator: this.responseDecoratorErrorLogger, //log 500 errors received from routed to servers
            proxyErrorHandler: this.generalErrorHandler, //handle errors that occur prior to routing to servers
            proxyReqOptDecorator :this.setHeaders //set the default content-type header to application/json so that it will be possible to append properties to body in cases such as route/:id/some where only path param is passed
        }
    }

    setHeaders(proxyReqOpts, srcReq){
        //set the default content type to json if not defined otherwise
        let headersList = Object.keys(proxyReqOpts.headers)
        if(!headersList.includes("Content-Type") && !headersList.includes("content-type")){
            proxyReqOpts.headers['Content-Type'] = 'application/json';
        }
        return proxyReqOpts;
    }

    pathResolver(targetPath,propsAppend: IRouteAppendToQueryConfig[]) {
        return (req) => {
            let baseUrl = req.url; //by default return the url as is
            if(targetPath){ //if a target path is defined - then use it
                baseUrl = targetPath;
            }
            if(propsAppend){ //if append query params - then append to the url
                baseUrl = this.appendPropertiesToQueryParams(baseUrl,req,propsAppend)
            }
            return baseUrl;
        }
    }

    //when required append a set of params to the query params list
    appendPropertiesToQueryParams(baseUrl:string,req,propsAppend: IRouteAppendToQueryConfig[]){
        if (propsAppend) {
            //create an array of prop=value from request and propAppend 
            let appendStrings = this.createPropArrayFromAppendData(req,propsAppend)
            //append the values to the query params
            baseUrl = this.appendQueryParamsToUrl(baseUrl,appendStrings);
        }
        return baseUrl;
    }

    //receive list of key=values and appends to the url
    private appendQueryParamsToUrl(baseUrl:string,params:string[]):string{
        if(params.length>0){
            let queryString = params.join("&")
            if(baseUrl.includes("?")){
                baseUrl += `&${queryString}`
            }else{
                baseUrl+=`?${queryString}`
            }
        }
        return baseUrl;
    }

    //creates an array of key=value from the list of required appended properties
    private createPropArrayFromAppendData(req,propsAppend: IRouteAppendToQueryConfig[]){
        let appendStrings = []
        propsAppend.forEach(prop => {
            if (prop.reqPath && prop.queryParamName) {
                let propValue = objectPath.get(req, prop.reqPath);
                appendStrings.push(`${prop.queryParamName}=${propValue}`)
            }
        })
        return appendStrings;
    }
    //when requested will append additional data to the body of the request
    appendPropertiesToBody(propsAppend: IRouteAppendToBodyConfig[]) {
        //return the method expected by proxyReqBodyDecorator yet now has access to propsAppend
        return (bodyContent, srcReq) => {
            if (propsAppend) {
                propsAppend.forEach(prop => {
                    if (prop.reqPath && prop.bodyPath) {
                        let propValue = objectPath.get(srcReq, prop.reqPath);
                        if(prop.appendToArray){
                            objectPath.push(bodyContent, prop.bodyPath, propValue)
                        }else{
                            objectPath.set(bodyContent, prop.bodyPath, propValue)
                        }
                    }
                })
            }
            return bodyContent;
        }
    }

    //default route method (verb) is get. Validate that method set is one of the following
    getPathMethod(method): string {
        if (method && ["get", "post", "put", "patch", "delete"].includes(method)) {
            return method
        } else {
            return "get"
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

    private onServerListen = () => {
        console.log('App listening on port ' + this.port);
        console.log("you are running in " + process.env.NODE_ENV + " mode.");
    }

    onError = (err: any) => {
        switch (err.code) {
            case 'EACCES':
                console.error('port requires elevated privileges');
                process.exit(1);
            case 'EADDRINUSE':
                console.error('port is already in use');
                process.exit(1);
            default:
                throw err;
        }
    }

    public setErrorHandlers = () => {
        this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status((<any>err).status || 500);
            res.send({
                message: err.message,
                error: err
            });
        });
    }

}