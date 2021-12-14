import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { UsersService } from "../users.service";

export class CurrentUserInterCeptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  async intercept(ctx: ExecutionContext, handler: CallHandler) {

    const request = ctx.switchToHttp().getRequest()
    const { userId } = request.session

    if(userId) {
      const user = await this.userService.findOne(userId)
      request.currentUser = user
    }

    return handler.handle();
  }
}