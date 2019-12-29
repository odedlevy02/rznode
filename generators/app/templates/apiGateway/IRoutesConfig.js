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
    description?:string,
    appendToBody?:IRouteAppendToBodyConfig[],
    appendToQuery?:IRouteAppendToQueryConfig[],
    middlewares?:any[]
}

export type IRouteAppendToBodyConfig={
    reqPath:string,
    bodyPath:string,
    appendToArray?:boolean
}
export type IRouteAppendToQueryConfig={
    reqPath:string,
    queryParamName?:string,
    appendToArray?:boolean
}