import { Controller, Post, Body, UseGuards, Get } from "@nestjs/common";

import { ExceptionBadRequest } from "src/utilities/exceptions";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { FAILED_LOGIN } from "src/utilities/errors";
import { UserGuard } from "src/utilities/guards/user.guard";
import { User } from "src/utilities/decorators/user.decorator";
import { UserService } from "src/user/user.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Get("profile")
  @UseGuards(UserGuard)
  async profile(@User("_id") userId: string) {
    try {
      return await this.userService.getProfile(userId);
    } catch (error) {
      throw new ExceptionBadRequest(FAILED_LOGIN);
    }
  }

  @Post("login")
  async loginInstructor(@Body() loginDto: LoginDto) {
    const user = await this.userService.findByLogin(loginDto);

    if (user) {
      const token = this.authService.generateUserToken(user);
      return { user, token };
    } else throw new ExceptionBadRequest(FAILED_LOGIN);
  }
}
