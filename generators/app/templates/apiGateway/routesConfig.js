import { IRoutesConfig } from "./dataModels/IRoutesConfig";

// export function authMiddleware(req, res, next) {
//     req.decodedToken = { userId: 1, roleId: 2}
//     next();
// }

export const routesConfig: IRoutesConfig = {
    //Sample hosts with paths
    // hosts: [
    //     {
    //         host: "http://localhost:3002", routes: [
    //             { source: "/users/getUserByParaId" },
    //             { source: "/users/saveUser",method:"post",tag:"Users",description:"add a user to users",inputSample:{name:"John",age:33} }, //sample when auto generating swagger with post- add tag, description and inputSample as json
    //             { source: "/users/getUser",method:"get",tag:"Users",description:"get a user with query param",inputSample:{id:12} }, //sample when auto generating swagger with get- add tag, description and inputSample as json with keys
    //             {source: "/users/appendToBody", method: "post",
    //                 middlewares: [authMiddleware],
    //                 appendToBody: [{ reqPath: "decodedToken.userId", bodyPath: "userId" }]},
    //             { source: "/users/createUser", target: "/users/createTheUsers",method:"post" },
    //             {source: "/users/appendToQuery", method: "get",
    //                 middlewares: [authMiddleware],
    //                 appendToQuery: [{ reqPath: "decodedToken.userId", queryParamName: "userId" }]},
    //         ]
    //     },
    //     {
    //         host: "http://localhost:3001",middlewares: [authMiddleware],routes: [  
    //             { source: "/api/*" },
    //         ]
    //     }
    // ]

}
