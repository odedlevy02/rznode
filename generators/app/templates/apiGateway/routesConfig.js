import { IRouteConfig } from "./dataModels/IRoutesConfig";

export const routesConfig: IRouteConfig = {}
    //Sample hosts with paths
    // hosts: [
    //     {
    //         basePath: "users", host: "http://localhost:3001", paths: [
    //             { source: "/users/:id", target: "/users/:id" },
    //             {source: "/users/genError", target: "/users/genError", method: "post",
    //                 middlewares: [authMiddleware],
    //                 appendToBody: [{ reqPath: "decodedToken.userId", bodyPath: "userId" }]},
    //             { source: "/users/getUsers", target: "/users/getUsers" },
    //             { source: "/users/createUser", target: "/users/createTheUsers" }
    //         ]
    //     }
    // ]


