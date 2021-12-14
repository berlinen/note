import { Body, Controller, Post, Get, Patch, Param, Query, Delete, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private aythService: AuthService
  ) {}

  @Post('/signup')
  createUset(@Body() body: CreateUserDto) {
    return this.aythService.signup(body.email, body.password)
  }

  @Post('/signin')
  signin(@Body() body: CreateUserDto) {
    return this.aythService.signin(body.email, body.password)
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto))
  // @Serialize(UserDto)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    // console.log('handler is running') second
    const user = await this.usersService.findOne(parseInt(id))
    if(!user) {
      throw new NotFoundException('user not found')
    }
    return user
  }

  @Get()
  async findAllUsers(@Query('email') email: string) {
    const user = await this.usersService.find(email)
    if(!user.length) {
      throw new NotFoundException('user not found')
    }
    return user
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id))
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body)
  }
}
