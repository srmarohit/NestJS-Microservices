import { ArgumentsHost, Catch } from "@nestjs/common";
import { BaseRpcExceptionFilter, RpcException } from "@nestjs/microservices";
import { Response } from "express";
import { Observable } from "rxjs";
import { RpcErrorPayload } from "./rpc.types";

@Catch()
export class RpcExceptionFilter extends BaseRpcExceptionFilter{
   catch(exception: any, host: ArgumentsHost): any {
        if(exception instanceof RpcException) {    
           return super.catch(exception, host);
        }

        const status = exception?.getStatus?.() || 500;
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if(status === 400){
            const payload : RpcErrorPayload = {
                code: 'VALIDATION_ERROR',
                message: exception?.getResponse?.()?.message || 'VALIDATION_ERROR',
                details: response || null
            }

            super.catch(new RpcException(payload), host);

        }

        
    const payload: RpcErrorPayload = {
      code: 'INTERNAL',
      message: 'Internal error',
    };

    return super.catch(new RpcException(payload), host);

   }
}