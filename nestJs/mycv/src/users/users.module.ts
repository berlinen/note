import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity'
import { AuthService } from './auth.service';
import { CurrentUserInterCeptor } from './interceptors/current-user.interceptors';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, CurrentUserInterCeptor]
})
export class UsersModule {}
