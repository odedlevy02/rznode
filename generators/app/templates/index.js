import { Server} from "./server";
import {config} from "dotenv";
import * as path from "path"
let configPath = path.join(__dirname, "./config/.env")
config({path: configPath});
const server = new Server();

server.setRoutes();
server.setStaticFolders();
server.setErrorHandlers();
server.startServer();
