import * as proxy from "express-http-proxy";
import * as http from "http"
import * as express from "express";
import * as bodyParser from "body-parser"
import * as compression from "compression"
import { IRoutesConfig, IHostConfig, IRouteAppendToBodyConfig, ISingleRouteConfig } from "./dataModels/IRoutesConfig";
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
            this.app[method](route.source, ...middlewareList, proxy(host.host, this.getGeneralOptions(route.target, route.appendToBody)))
        } else {
            this.app[method](route.source, proxy(host.host, this.getGeneralOptions(route.target, route.appendToBody)))
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
    getGeneralOptions(targetPath, appendProps: IRouteAppendToBodyConfig[]) {
        return {
            proxyReqPathResolver: this.pathResolver(targetPath), //needed in order to return the original path
            proxyReqBodyDecorator: this.appendPropertiesToBody(appendProps), //returns a method. Receives a list of required fields to append and will append to body
            userResDecorator: this.responseDecoratorErrorLogger, //log 500 errors received from routed to servers
            proxyErrorHandler: this.generalErrorHandler //handle errors that occur prior to routing to servers
        }
    }

    pathResolver(targetPath) {
        return (req) => {
            if(targetPath){
                return targetPath;
            }else{
                return req.url
            }
        }
    }

    appendPropertiesToBody(propsAppend: IRouteAppendToBodyConfig[]) {
        //return the method expected by proxyReqBodyDecorator yet now has access to propsAppend
        return (bodyContent, srcReq) => {
            if (propsAppend) {
                propsAppend.forEach(prop => {
                    if (prop.reqPath && prop.bodyPath) {
                        let propValue = objectPath.get(srcReq, prop.reqPath);
                        objectPath.set(bodyContent, prop.bodyPath, propValue)
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