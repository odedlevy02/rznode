import {Router} from "express";
import * as express from "express";
import {<%=modulename%>Service} from "./<%=modulenameLower%>.service" 
import { serviceErrorReduce } from "../../helpers/serviceErrorReducer";

class <%=modulename%>Router{

  router: Router;

  constructor() {
    this.router = express.Router();
    this.createRoutes();
  }

  private createRoutes() {
    this.router.get("/sample", this.sample);
  }

  sample=async (req,res)=>{
    try {
      let result = null //await new <%=modulename%>Service().sample()
      res.status(200).send(result)
    } catch (err) {
      let error = serviceErrorReduce(err);
      console.error("Error in sample: ", error)
      res.status(500).send({ message: error })
    }
  }
}

export const <%=modulenameLower%>Router= new <%=modulename%>Router().router;
//Note - validate that -  this.app.use("/<%=modulenameLower%>",<%=modulenameLower%>Router); - was added to server.ts in method setRoutes
