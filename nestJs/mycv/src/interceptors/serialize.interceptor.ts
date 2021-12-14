import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { plainToClass } from 'class-transformer'

interface ClassConstructor {
  new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializerInterceptor(dto))
}

export class SerializerInterceptor implements NestInterceptor {
  constructor(private userDto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // run sonething before a request is handled
    // bu the request handler
    // console.log('Im running before the handler', context) first
    return handler.handle().pipe(
      map((data: any) => {
        // run something before the response is sent out  third
        return plainToClass(this.userDto, data, {
          excludeExtraneousValues: true
        })
      })
    )
  }
}