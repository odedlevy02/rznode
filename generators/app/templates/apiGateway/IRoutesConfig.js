export type IRouteConfig={
    hosts?:{
        basePath:string,host:string,paths:IRoutePath[]
    }[]
} 

export type IRoutePath ={
    source:string,
    target:string,
    method?:string,
    appendToBody?:IRouteAppendToBody[],
    middlewares?:any[]
}

export type IRouteAppendToBody={
    reqPath:string,
    bodyPath:string
}