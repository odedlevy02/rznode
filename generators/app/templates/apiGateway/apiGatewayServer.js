import * as proxy from "express-http-proxy";
import * as http from "http"
import * as express from "express";
import * as bodyParser from "body-parser"
import * as compression from "compression"
import { IRouteConfig, IRoutePath, IRouteAppendToBody } from "./dataModels/IRoutesConfig";
import * as objectPath from "object-path";
import * as swaggerUi from "swagger-ui-express"
import * as chalk from "chalk";
export class ApiGatewayServer {

    app: express.Application = null;
    port = process.env.PORT || 3000;
    config: IRouteConfig = null;
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(compression());

    }

    public setSwagger=()=>{
        let swaggerDocument = require('./swagger.json');
        this.app.use('/explorer', swaggerUi.serve, swaggerUi.setup(swaggerDocument,{"showExplorer": true}));
        console.log(`For exploring the apis open: http://localhost:${this.port}/explorer`)
      }
    

    public startServer = () => {
        var httpServer = http.createServer(this.app);
        httpServer.listen(this.port);
        httpServer.on('error', this.onError);
        httpServer.on('listening', this.onServerListen);
    }

    //add any custom route 
    setCustomRoutes(){
        //sample
        // this.app.post("/customRoute",(req,res)=>{
        //     res.status(200).send({message:"I am custom"})
        // })
    }

    //main method. Will receive a route config and will iterate over all its routes
    //Will then create an express route, append middleware and set the default options that will enable
    //to catch errors, append properties and resolve paths
    setRoutesFromConfig(config: IRouteConfig) {
        this.config = config;
        this.appendAllHostPaths(config).forEach(path => {
            let method = this.getPathMethod(path.method);
            if (path.middlewares && path.middlewares.length > 0) {
                this.app[method](path.source, ...path.middlewares, proxy(this.selectProxyHost, this.getGeneralOptions(path.appendToBody)))
            } else {
                this.app[method](path.source, proxy(this.selectProxyHost, this.getGeneralOptions(path.appendToBody)))
            }
            console.log(chalk.green(`[${method}] ${path.source} -> ${this.selectProxyHostFromUrl(path.source)}${path.target}`))
        });
    }

    //return the general options for proxy 
    getGeneralOptions(appendProps: IRouteAppendToBody[]) {
        return {
            proxyReqPathResolver: this.pathResolver, //needed in order to return the original path
            proxyReqBodyDecorator: this.appendPropertiesToBody(appendProps), //returns a method. Receives a list of required fields to append and will append to body
            userResDecorator: this.responseDecoratorErrorLogger, //log 500 errors received from routed to servers
            proxyErrorHandler: this.generalErrorHandler //handle errors that occur prior to routing to servers
        }
    }

    appendPropertiesToBody(propsAppend: IRouteAppendToBody[]) {
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

    //on request - extract the first part of the path and try to map it to the relevant base host (e.g. http://localhost:3005)
    selectProxyHost = (req) => {
        return this.selectProxyHostFromUrl(req.originalUrl)
    }

    selectProxyHostFromUrl(originalUrl){
        let paths = originalUrl.split("/")
        let url = this.config.hosts.find(host => host.basePath == paths[1])
        return url.host;
    }

    pathResolver(req) {
        return req.originalUrl;
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

    appendAllHostPaths(config: IRouteConfig): IRoutePath[] {
        let paths = []
        if(config && config.hosts && config.hosts.length>0){
            config.hosts.forEach(host => {
                paths = paths.concat(host.paths);
            })
        }
        return paths
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
                break;
            case 'EADDRINUSE':
                console.error('port is already in use');
                process.exit(1);
                break;
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