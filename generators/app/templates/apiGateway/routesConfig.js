import { IRoutesConfig } from "./dataModels/IRoutesConfig";

export const routesConfig: IRoutesConfig = {
    //Sample hosts with paths
    // hosts: [
    //     {
    //         host: "http://localhost:3002", routes: [
    //             { source: "/users/getUserByParaId" },
    //             {source: "/users/appendToBody", target: "/users/appendToBody", method: "post",
    //                 //middlewares: [authMiddleware],
    //                 appendToBody: [{ reqPath: "decodedToken.userId", bodyPath: "userId" }]},
    //             {source: "/users/genError", method: "post"},
    //             { source: "/users/getUsers"  },
    //             { source: "/users/createUser", target: "/users/createTheUsers",method:"post" },
    //             { source: "/users/:id" }
    //         ]
    //     },
    //     {
    //         host: "http://localhost:3001",routes: [ //middlewares: [authMiddleware], 
    //             { source: "/api/*" },
    //         ]
    //     }
    // ]

}
