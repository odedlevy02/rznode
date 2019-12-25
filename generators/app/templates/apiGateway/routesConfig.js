import { IRoutesConfig } from "./dataModels/IRoutesConfig";

export const routesConfig: IRoutesConfig = {
    //Sample hosts with paths
    // hosts: [
    //     {
    //         host: "http://localhost:3002", routes: [
    //             { source: "/users/:id", target: "/users/:id" },
    //             {source: "/users/genError", target: "/users/genError", method: "post",
    //                 middlewares: [authMiddleware],
    //                 appendToBody: [{ reqPath: "decodedToken.userId", bodyPath: "userId" }]},
    //             { source: "/users/getUsers", target: "/users/getUsers" },
    //             { source: "/users/createUser", target: "/users/createTheUsers",method:"post" }
    //         ]
    //     },
    //     {
    //         host: "http://localhost:3001",middlewares: [authMiddleware], routes: [
    //             { source: "/dal/users/:id", target: "/users/:id" },
    //         ]
    //     }
    // ]

}
