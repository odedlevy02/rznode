import {Router} from "express";
import * as express from "express";
class <%=routename%>Router{

  router: Router;

  constructor() {
    this.router = express.Router();
    this.createRoutes();
  }

  private createRoutes() {
    this.router.get("/sample", this.sample);
  }

  sample=(req,res,next)=>{
    res.status(200).send({res:"Response"})
  }
}

export const <%=routenameLower%>Router= new <%=routename%>Router().router;
//Note - add to server.ts method setRoutes:  this.app.use("/<%=routenameLower%>",<%=routenameLower%>Router);
