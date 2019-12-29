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
