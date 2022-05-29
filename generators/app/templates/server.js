import * as express from "express";
import * as http from "http";
import * as bodyParser from "body-parser"
import * as compression from "compression"
import * as swaggerUi from "swagger-ui-express"
import { logRouteCalls } from './helpers/addSupportForLogs';
import {existsSync,readFileSync} from "fs"

export class Server {
  private app: express.Express;
  private port: any = 3000;

  constructor() {
    this.app = express();
    this.app.use(compression());
    this.app.use(bodyParser.json()); // support json encoded bodies
    this.app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
    this.app.use(logRouteCalls());
    this.port = process.env.PORT || this.port;

  }

  public setRoutes = () => {
    //this.app.use("/temp",tempRouter);
  }

  public startServer = () => {
    var httpServer = http.createServer(this.app);
    httpServer.listen(this.port);
    httpServer.on('error', this.onError);
    httpServer.on('listening', this.onServerListen);
  }

  //When hosting a client app such as angular - map the path to the client dist folder
  public setStaticFolders = () => {
    // var path = require('path');
    // let clientPath = path.join(__dirname, '../<client folder>/dist');
    //console.log(`adding static folder: ${clientPath}`)
    // this.app.use(express.static(clientPath));
  }

  public setSwagger = () => {
    let swaggerDocument = require('./swagger.json');
    this.app.use('/explorer', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { "showExplorer": true }));
    console.log(`For exploring the apis open: http://localhost:${this.port}/explorer`)
  }

  public setDynamicSwagger() {
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

  private loadSwaggerJson() {
    if (existsSync("swagger.json")) {
      let fileContent = readFileSync("swagger.json")
      return JSON.parse(<any>fileContent);
    } else {
          console.log("swagger.json file does not exist in this folder ", __dirname)
        return null;
    }
}


  private onServerListen=()=>{
          console.log('App listening on port ' + this.port);
        console.log("you are running in " + process.env.NODE_ENV + " mode.");
      }
    
  onError=(err:any)=>{
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
  
  public setErrorHandlers=()=>{
          this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status((<any>err).status || 500);
      res.send({
                message: err.message,
              error: err
            });
          });
        }
      }
