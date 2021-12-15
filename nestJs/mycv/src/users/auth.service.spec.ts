import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from './user.entity'

describe('AuthService', () => {
  let service: AuthService
  let fakeUsersService: Partial<UsersService>

  beforeEach(async() => {
    // create a fake copy of the users service
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) => Promise.resolve({id: 1, email, password} as User)
    }
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile()

    service = module.get(AuthService)
  })

  it('can create an instance of auth service', async() => {
    expect(service).toBeDefined()
  })

  it('creates a new user with a salted and hashed password', async() => {
    const user = await service.signup('abc@test.com', '123456')

    expect(user.password).not.toEqual('123456')
    const [salt, hash] = user.password.split('.')
    expect(salt).toBeDefined()
    expect(hash).toBeDefined()
  })

  it('throws an error if user sign up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'abc@test.com', password: '123456'} as User])
    try {
      await service.signup('129239@qq.com	', '123456')
    } catch(err) {

    }
  })
})



