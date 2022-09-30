import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { SimpleSpanProcessor,BatchSpanProcessor, ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";
import  { ExpressInstrumentation }from "opentelemetry-instrumentation-express";
import  { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { env } from "process";

export class Tracer{
    init(serviceName){
      const provider = new NodeTracerProvider({
        resource: new Resource({
          [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
      });
    // For testing traces in console  
    // const exporter = new ConsoleSpanExporter();  
    const exporter = new JaegerExporter({
        endpoint: env.JAEGER_TRACE_URL || "http://localhost:14268/api/traces",
    });
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    provider.register();
    registerInstrumentations({
        instrumentations: [
          new ExpressInstrumentation({requestHook: (span, requestInfo) => {
            //collect req body
            let rawBody = '';
            requestInfo.req.on('data', function(chunk) { 
              rawBody += chunk;
            });
            requestInfo.req.on('end', function() {
              span.setAttribute("http.request.body", rawBody.toString());
            });
            //req query params
            span.setAttribute("http.request.params", JSON.stringify(requestInfo.req.query));
    
          },includeHttpAttributes:true}),
        ]
    });
    }
}

