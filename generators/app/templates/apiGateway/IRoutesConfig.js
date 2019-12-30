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
    isFileUpload?:boolean
    description?:string,
    tag?:string, //required only when need to build auto generate swagger - this is the tag name in swagger
    inputSample?:any, //required only when need to build auto generate swagger - defines the input with sample data
    appendToBody?:IRouteAppendToBodyConfig[],
    appendToQuery?:IRouteAppendToQueryConfig[],
    appendToHeader?:IRouteAppendToHeaderConfig[],
    middlewares?:any[]
}

export type IRouteAppendToHeaderConfig ={
    reqPath:string,
    headerKey:string
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