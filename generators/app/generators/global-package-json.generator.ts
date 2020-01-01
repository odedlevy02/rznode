import { readdirSync, existsSync, writeFileSync,readFileSync } from "fs";

export function buildPackageJsonScripts() {
    let packageJson = loadPackageJson()
    if(!packageJson){
        return;
    }

    let packageJsonDirs = getPackageJsonFolders();
    let [serverInstallDict, serverTranspileDict, clientInstallDict] = [new Map<string, string>(), new Map<string, string>(), new Map<string, string>()];
    fillInstallAndTranspileMaps(packageJsonDirs, serverInstallDict, serverTranspileDict, clientInstallDict);
    let scripts = {};
    buildPackageJsonScriptFromMap(scripts, serverInstallDict)
    buildPackageJsonScriptFromMap(scripts, serverTranspileDict)
    buildPackageJsonScriptFromMap(scripts, clientInstallDict)
    scripts["server:install:all"] = createRunAllScript(serverInstallDict);
    scripts["server:transpile:all"] = createRunAllScript(serverTranspileDict);
    scripts["clients:install:all"] = createRunAllScript(clientInstallDict);
    scripts["install:all"] = "npm run server:install:all && npm run server:transpile:all && npm run client:install:all"
    packageJson.scripts = scripts;
    savePackageJson(packageJson)
    
}

function buildPackageJsonScriptFromMap(scriptObj:any, scriptMap:Map<string,string>){
    for(let [key,value] of scriptMap.entries()){
        scriptObj[key]= value;
    }
}

function savePackageJson(packageJson:any){
    writeFileSync("package.json",JSON.stringify(packageJson, null, 4))
}

function loadPackageJson(){
    if(existsSync("package.json")){
        let fileContent = readFileSync("package.json")
        return JSON.parse(<any>fileContent);
    }else{
        console.log("package.json file does not exist in folder ",__dirname)
        return null;
    }
}

function createRunAllScript(scriptMap: Map<string, string>) {
    let keys = [...scriptMap.keys()];
    return keys.map(key => `npm run ${key}`).join(" && ")
}

function fillInstallAndTranspileMaps(packageJsonDirs: string[], serverInstallDict: Map<string, string>, serverTranspileDict: Map<string, string>, clientInstallDict: Map<string, string>) {
    packageJsonDirs.forEach(fullPath => {
        let folderName = fullPath.split("/").pop();
        let root = getFolderRootType(fullPath)
        if (root == "server") {
            createInstallDict(fullPath, folderName, root, serverInstallDict);
            createTranspileDict(fullPath, folderName, root, serverTranspileDict)
        } else {
            createInstallDict(fullPath, folderName, root, clientInstallDict);
        }
    })
}

function getFolderRootType(fullPath) {
    let parts = fullPath.split("/")
    let clientParts = parts.filter(part => part.includes("client"))
    if (clientParts.length > 0) {
        return "client"
    } else {
        return "server";
    }
}

function createInstallDict(fullPath: string, folderName, root: string, scriptsDict: Map<string, string>) {
    let keyName = `${root}:install:${folderName}`
    let value = `cd ${fullPath} && npm i`
    scriptsDict.set(keyName, value);
}

function createTranspileDict(fullPath: string, folderName, root: string, scriptsDict: Map<string, string>) {
    let keyName = `${root}:transpile:${folderName}`
    let value = `cd ${fullPath} && npm run build`
    scriptsDict.set(keyName, value);
}


function getDirectories(source) {

    if (existsSync(source)) {
        return readdirSync(source, { withFileTypes: true })
            .filter(dir => dir.isDirectory())
            .map(dir => `${source}/${dir.name}`)
    } else {
        return [];
    }
}
export function getPackageJsonFolders(source = ".") {
    //get up to 2 levels down
    let dirs = [];
    let rootDirs = getDirectories(source)
    rootDirs.forEach(childDir => {
        dirs.push(childDir)
        let childDirs = getDirectories(childDir);
        dirs = [...dirs, ...childDirs]
    })
    let packageJsonDirs = dirs.filter(dir => existsSync(`${dir}/package.json`));
    return packageJsonDirs;
}


