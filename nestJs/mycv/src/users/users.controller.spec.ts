 import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { User } from './user.entity'

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>
  let fakeAuthService: Partial<AuthService>

  beforeEach(async () => {
    fakeUsersService = {
      findOne(id: number) {
        return Promise.resolve({ id,  email: 'aa@test.com', password: '123'} as User)
      },
      find(email: string) {
        return Promise.resolve([{ id: 1,  email: 'aa@test.com', password: '123'} as User])
      },
      // remove() {},
      // update() {}
    }
    fakeAuthService = {
      // signup() {},
      // signin() {}
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async() => {
    const users = await controller.findAllUsers('aa@test.com')
    expect(users.length).toEqual(1)
    expect(users[0].email).toEqual('aa@test.com')
  })

  it('finduse returns a single user with the gived id', async() => {
    const user = await controller.findUser('1')
    expect(user).toBeDefined()
  })

  it('finduser throw an err if user with given iid is not found', async() => {
    fakeUsersService.findOne = () => null
    await controller.findUser('1')
  })
});
