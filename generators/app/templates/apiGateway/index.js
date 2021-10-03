
import {config} from "dotenv";
import * as path from "path"
import {displayEnv} from "dotenv-display"
//Load and display config variables defined in .env file
let configPath = path.join(__dirname, "./.env")
let env = config({path: configPath});
displayEnv(env.parsed)

import { routesConfig } from "./routesConfig";
import { Server } from "./server";
//Load server
const server = new Server();

server.setRoutesFromConfig(routesConfig);
server.autoGenerateSwagger();
server.setCustomRoutes();
// server.setStaticFolders();
server.setDynamicSwagger();
server.setErrorHandlers();
server.startServer();
