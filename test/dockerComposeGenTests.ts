import * as sinon from "sinon";
import * as assert from "assert";
import {  getDockerServices } from "../generators/app/generators/docker-compose/docker-compose.generator";


describe("docker compose gen tests",()=>{
    it.skip("should get folders containing Dockerfiles",()=>{
        let source = "C:/Temp/Workshop/Workshop1";
        let res = getDockerServices(source)  
        console.log(res);
    })
    
})