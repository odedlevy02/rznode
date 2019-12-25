export type IRoutesConfig={
    hosts?:IHostConfig[]
} 

export type IHostConfig={
    host:string,middlewares?:any[],routes:ISingleRouteConfig[]
}

export type ISingleRouteConfig ={
    source:string,
    target?:string,
    method?:string,
    appendToBody?:IRouteAppendToBodyConfig[],
    middlewares?:any[]
}

export type IRouteAppendToBodyConfig={
    reqPath:string,
    bodyPath:string
}