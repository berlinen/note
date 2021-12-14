import { BadGatewayException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    // see id email in use
    const users = await this.userService.find(email)
    if(users.length) {
      throw new BadGatewayException('email in use')
    }
    // hase the users password
    // generate a salt
    // 缓冲区将有8个字节的数据
    const salt = randomBytes(8).toString('hex')
    // hash the salt the passwoed together 32 bytes
    const hash = (await scrypt(password, salt, 32)) as Buffer
    // join rhe hasheed result and the sale together
    const result = salt + '.' + hash.toString('hex')
    // create a new user and save it
    
    // return the user
  }

  signin() {

  }
}