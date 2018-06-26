import * as express from "express";
import * as http from "http";
import * as bodyParser from "body-parser"
import * as compression from "compression"

export class Server{
  private app:express.Express;
  private port:any=3000;

  constructor(){
    this.app = express();
    this.app.use(compression());
    this.app.use(bodyParser.json()); // support json encoded bodies
    this.app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

    this.port = process.env.PORT || this.port;

  }

  public setRoutes=()=>{
  //this.app.use("/temp",tempRouter);
  }

  public startServer=()=>{
    var httpServer = http.createServer(this.app);
    httpServer.listen(this.port);
    httpServer.on('error',this.onError);
    httpServer.on('listening',this.onServerListen);
  }

  //When hosting a client app such as angular - map the path to the client dist folder
  public setStaticFolders=()=>{
    // var path = require('path');
    // let clientPath = path.join(__dirname, '../<client folder>/dist');
    //console.log(`adding static folder: ${clientPath}`)
    // this.app.use(express.static(clientPath));
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
    this.app.use((err:Error, req:express.Request, res:express.Response, next:express.NextFunction)=>{
      res.status((<any>err).status || 500);
      res.send({
        message: err.message,
        error: err
      });
    });
  }
}
