import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users';
import { VerificationTokenPayload } from './interfaces';

@Injectable()
export class EmailVerificationService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  sendVerificationLink(email: string) {
    return null;
  }

  async verifyFromToken(token: string) {
    const { email } =
      await this.jwtService.verifyAsync<VerificationTokenPayload>(token);
    const user = await this.usersService.findByEmail(email);

    if (!user || user.isEmailVerified) {
      throw new BadRequestException();
    }

    return this.usersService.verifyEmail(email);
  }
}
