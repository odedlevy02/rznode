import { AppDataStore } from "../../dal/dbConnectionManager";
import { <%=entityClassName%> } from "../../entities/<%=entityNameCamel%>.entity";

export class <%=moduleServiceName%>{

    async getAll<%=entityNamePascalPlural%>(limit){
        const repo = await AppDataStore.getRepository(<%=entityClassName%>)
        const <%=entityNameCamelPlural%>  = await repo.find({take:limit})
        return <%=entityNameCamelPlural%> 
    }
    async get<%=entityNamePascal%>ById(id){
        const repo = AppDataStore.getRepository(<%=entityClassName%>)
        const <%=entityNameCamel%> = await repo.findOneBy({id})
        return {<%=entityNameCamel%>}
    }

    async save<%=entityNamePascal%>(<%=entityNameCamel%> :<%=entityClassName%>){
        const <%=entityNameCamel%>Repo = await AppDataStore.getRepository(<%=entityClassName%>)
        const <%=entityNameCamel%>Result = await <%=entityNameCamel%>Repo.save(<%=entityNameCamel%> )
        return {<%=entityNameCamel%> :<%=entityNameCamel%>Result};
    }

    async delete<%=entityNamePascal%>ById(id){
        if(!id){
            throw new Error(`id is mandatory`)
        }
        const repo = await AppDataStore.getRepository(<%=entityClassName%>);
        const delResult = await repo.delete(id)
        return {numDeleted:delResult.affected}
    }


}