import { BadGatewayException, Injectable } from "@nestjs/common";
import { identity } from "rxjs";
import { UsersService } from "./users.service";

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

    // create a new user and save it

    // return the user  
  }

  signin() {

  }
}