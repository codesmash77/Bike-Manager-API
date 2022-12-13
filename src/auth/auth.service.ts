import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtTokenService: JwtService,
  ) {}

  async validateUserCredentials(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserbyEmail(email);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async loginWithCredentials(user: any) {
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      password: user.password,
    };

    return {
      access_token: this.jwtTokenService.sign(payload),
      userId: payload.userId,
      userRole: payload.role,
      userName: payload.username,
      userEmail: payload.email,
    };
  }
}
