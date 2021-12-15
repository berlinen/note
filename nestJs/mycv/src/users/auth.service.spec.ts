import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from './user.entity'

describe('AuthService', () => {
  let service: AuthService
  let fakeUsersService: Partial<UsersService>

  beforeEach(async() => {
    // create a fake copy of the users service
    const users: User[] = []
    fakeUsersService = {
      find: (emeil: string) => {
        const filteredUsers = users.filter(user => user.email === emeil)
        return Promise.resolve(filteredUsers)
      },
      create: (email: string, password: string) => {
        const user = {id: Math.floor(Math.random() * 9999), email, password} as User
        users.push(user)
        return Promise.resolve(user)
      }
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
    await service.signup('129239@qq.com	', '123456')
    await service.signup('1292391@qq.com	', '123456')
  })

  it('throws if signin is called with an unused email', async () => {
    await service.signup('aas@test.com', 'ssss')
    await service.signin('aasaaaasasassa@test.com', 'ssss')
  })

  it('throws if an invalid password is provided', async() => {
     await service.signup('aassss@test.com', 'ssss')
     await service.signin('aassss@test.com', 'ssss')
  })

  it('returns a user if coorect password is provided', async() => {
    await service.signup('aas@test.com', 'ssss')
    const user = await service.signin('aas@test.com', 'ssss')
    expect(user).toBeDefined()
  })
})



