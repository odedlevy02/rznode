import * as http from "http"
import * as express from "express";
import * as bodyParser from "body-parser"
import * as compression from "compression"
import * as swaggerUi from "swagger-ui-express"
import * as cors from "cors"
import {existsSync,readFileSync} from "fs"
import { IRoutesConfig } from "./apiGateway/IRoutesConfig";
import { generateSwagger } from './apiGateway/swagger.generator';
import { ApiGatewayRouteBuilder } from "./apiGateway/apiGatewayRouteBuilder";

export class Server {

    app: express.Application = null;
    port = process.env.PORT || 3000;
    
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(compression());
        this.app.use(cors())

    }

    autoGenerateSwagger(){
        generateSwagger()
    }

    public setSwagger = () => {
        let swaggerDocument = require('./swagger.json');
        this.app.use('/explorer', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { "showExplorer": true }));
        console.log(`For exploring the apis open: http://localhost:${this.port}/explorer`)
    }

    //No need to restart server
    setDynamicSwagger(){
        this.app.use('/explorer', swaggerUi.serve, async (req, res, next) => {
            try {
              let swaggerDocument = this.loadSwaggerJson()
              let func = swaggerUi.setup(swaggerDocument, { "showExplorer": true });
              func(req, res)
              next()
            } catch (err) {
              next(err)
            }
          });
          console.log(`For exploring the apis open: http://localhost:${this.port}/explorer`)
    }

    loadSwaggerJson() {
        if (existsSync("swagger.json")) {
            let fileContent = readFileSync("swagger.json")
            return JSON.parse(<any>fileContent);
        } else {
            console.log("swagger.json file does not exist in this folder ", __dirname)
            return null;
        }
    }


    public startServer = () => {
        var httpServer = http.createServer(this.app);
        httpServer.listen(this.port);
        httpServer.on('error', this.onError);
        httpServer.on('listening', this.onServerListen);
    }

    setRoutesFromConfig(config: IRoutesConfig){
        let apiGateway = new ApiGatewayRouteBuilder(config,this.app)
        apiGateway.setRoutesFromConfig()
    }

    //add any custom route 
    setCustomRoutes() {
       // this.app.use("/devices", authMiddlewareMock, devicesRouter);
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