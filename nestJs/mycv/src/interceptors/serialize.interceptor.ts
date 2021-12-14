import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { plainToClass } from 'class-transformer'

export class SerializerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // run sonething before a request is handled
    // bu the request handler
    // console.log('Im running before the handler', context) first
    return handler.handle().pipe(
      map((data: any) => {
        // run something before the response is sent out
        console.log('Im runing before response is sent out', data) // third
        return data
      })
    )
  }
}