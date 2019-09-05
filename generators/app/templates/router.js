import {Router} from "express";
import * as express from "express";
import {<%=modulename%>Service} from "./<%=modulenameLower%>.service" 

class <%=modulename%>Router{

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

export const <%=modulenameLower%>Router= new <%=modulename%>Router().router;
//Note - add to server.ts method setRoutes:  this.app.use("/<%=modulenameLower%>",<%=modulenameLower%>Router);
