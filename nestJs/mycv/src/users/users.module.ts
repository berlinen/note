import { Module, MiddlewareConsumer } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity'
import { AuthService } from './auth.service';
import { CurrentUserInterCeptor } from './interceptors/current-user.interceptors';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UsersController],
  // providers: [UsersService, AuthService],
  providers: [
    UsersService,
    AuthService,
    // 中间件代替
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterCeptor
    }
  ]
})
export class UsersModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(CurrentUserMiddleware).forRoutes('*')
  // }
}
