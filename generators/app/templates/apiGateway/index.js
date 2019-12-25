
import {config} from "dotenv";
import * as path from "path"
import {displayEnv} from "dotenv-display"
//Load and display config variables defined in .env file
let configPath = path.join(__dirname, "./.env")
let env = config({path: configPath});
displayEnv(env.parsed)

import { ApiGatewayServer} from "./apiGatewayServer";
import { routesConfig } from "./routesConfig";
//Load server
const server = new ApiGatewayServer();

server.setRoutesFromConfig(routesConfig);
server.setCustomRoutes();
// server.setStaticFolders();
server.setSwagger();
server.setErrorHandlers();
server.startServer();
