import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { UsersService } from "../users.service";

@Injectable()
export class CurrentUserInterCeptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(ctx: ExecutionContext, handler: CallHandler) {

    const request = ctx.switchToHttp().getRequest()

    const { userId } = request.session

    console.log('>>>>', this.usersService)

    if(userId) {
      const user = await this.usersService.findOne(userId)
      request.currentUser = user
    }

    return handler.handle();
  }
}