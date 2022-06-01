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
    this.router.get("/", this.getAll<%=entityNamePascal%>);
    this.router.get("/:id", this.get<%=entityNamePascal%>ById);
    this.router.post("/", this.save<%=entityNamePascal%>);
    this.router.delete("/:id", this.delete<%=entityNamePascal%>ById);
  }

  getAll<%=entityNamePascal%>=async (req,res)=>{
    try {
      const {limit} = req.query
      let result = await new <%=moduleServiceName%>().getAll<%=entityNamePascal%>(limit)
      res.status(200).send(result)
    } catch (err) {
      let error = serviceErrorReduce(err);
      console.error("Error in getAll<%=entityNamePascal%>: ", error)
      res.status(500).send({ message: error })
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
//Note - add to server.ts method setRoutes:  this.app.use("/<%=modulenameLower%>",<%=modulenameLower%>Router);
