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
    this.router.get("/", this.getAll<%=entityNamePascalPlural%>);
    this.router.get("/:id", this.get<%=entityNamePascal%>ById);
    this.router.post("/", this.save<%=entityNamePascal%>);
    this.router.delete("/:id", this.delete<%=entityNamePascal%>ById);
  }

  getAll<%=entityNamePascalPlural%>=async (req,res,next)=>{
    try {
      const {limit} = req.query
      let result = await new <%=moduleServiceName%>().getAll<%=entityNamePascalPlural%>(limit)
      res.status(200).send(result)
    } catch (err) {
      let error = serviceErrorReduce(err);
      console.error("Error in getAll<%=entityNamePascalPlural%>: ", error)
      // err.status = 400
      next(err)
    }
  }

  get<%=entityNamePascal%>ById=async (req,res)=>{
    try {
      const {id} = req.params
      let result = await new <%=moduleServiceName%>().get<%=entityNamePascal%>ById(id)
      res.status(200).send(result)
    } catch (err) {
      let error = serviceErrorReduce(err);
      console.error("Error in get<%=entityNamePascal%>ById: ", error)
      res.status(500).send({ message: error })
    }
  }

  save<%=entityNamePascal%>=async (req,res)=>{
    try {
      const <%=entityNameCamel%> = req.body
      let result = await new <%=moduleServiceName%>().save<%=entityNamePascal%>(<%=entityNameCamel%>)
      res.status(200).send(result)
    } catch (err) {
      let error = serviceErrorReduce(err);
      console.error("Error in create<%=entityNamePascal%>: ", error)
      res.status(500).send({ message: error })
    }
  }


  delete<%=entityNamePascal%>ById=async (req,res)=>{
    try {
      const <%=entityNameCamel%> = req.params
      let result = await new <%=moduleServiceName%>().delete<%=entityNamePascal%>ById(<%=entityNameCamel%>)
      res.status(200).send(result)
    } catch (err) {
      let error = serviceErrorReduce(err);
      console.error("Error in delete<%=entityNamePascal%>ById: ", error)
      res.status(500).send({ message: error })
    }
  }

}

export const <%=modulenameLower%>Router= new <%=modulename%>Router().router;
//Note - validate that -  this.app.use("/<%=modulenameLower%>",<%=modulenameLower%>Router); - was added to server.ts in method setRoutes
