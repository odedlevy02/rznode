
import { DataSource, DataSourceOptions } from "typeorm"
import { rootFolder } from "../rootFolder";
/* istanbul ignore file */
export let AppDataStore: DataSource = null


export async function initDbStore() {
    const dbSettings = getDbSettings();
    try {
        AppDataStore = new DataSource(dbSettings)
        await AppDataStore.initialize()
        console.log(`Db initialized. Host: ${dbSettings.host}, port: ${dbSettings.port}`)
    } catch (err) {
        console.error(`dbConnectionManager - error initializing db. Error: ${err.message}`)
    }
}

function getDbSettings() {
    const dbSettings: DataSourceOptions = {
        type: "postgres",
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: +process.env.DB_PORT,
        synchronize: process.env.DB_SYNCHRONIZE == "1" ? true : false,
        database: process.env.DB_DEFAULT_DATABASE,
        entities: [getDirEntities()],
        migrations:[getDirMigrations()]
    }
    return dbSettings
}


function getDirEntities() {
    const isTsNode = process.env.TS_NODE_DEV;
    const dirNameEntities = isTsNode ? rootFolder + '/entities/*.ts' : rootFolder + '/entities/*.js';
    return dirNameEntities
}

function getDirMigrations(){
    const migrations = `${rootFolder}/migrations/*.js`
    return migrations
}

/**
 * Should be used for unit testing in memory db
 */
export async function initDbStoreForTests() {
    const dbSettings ={
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [getDirEntities()],
        synchronize: true,
        logging: false
    } as any;
    try {
        AppDataStore = new DataSource(dbSettings)
        await AppDataStore.initialize()
        console.log(`In memory Db initialized`)
    } catch (err) {
        console.error(`dbConnectionManager - error initializing db. Error: ${err.message}`)
    }
}
