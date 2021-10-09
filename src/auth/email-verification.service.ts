import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users';
import { ConfigService } from '../config';
import { MailsService } from '../mails';
import { InvalidTokenException } from './exceptions';

@Injectable()
export class EmailVerificationService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private mailsService: MailsService,
    private configService: ConfigService,
  ) {}

  async sendVerificationLink(email: string) {
    const token = await this.createVerificationToken(email);
    const link = this.createVerificationLink(token);
    const { firstName } = await this.usersService.findByEmail(email);

    return this.mailsService.sendEmailVerificationMail({
      email,
      firstName,
      link
    });
  }

  async verifyFromToken(token: string) {
    const user = await this.getUserFromToken(token);

    if (!user) {
      throw new InvalidTokenException();
    }

    if (!user.isEmailVerified) {
      return this.usersService.verifyEmail(user.email);
    }
  }

  private createVerificationToken(email: string) {
    const signOptions = { expiresIn: this.configService.get('auth.emailVerification.expiresIn') };

    return this.jwtService.signAsync(
      { email },
      signOptions
    );
  }

  private createVerificationLink(token: string) {
    return `${this.configService.get('auth.emailVerification.url')}?token=${token}`;
  }


  private async getUserFromToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);

      return payload?.email
        ? this.usersService.findByEmail(payload.email)
        : null;
    } catch (e) {
      return null;
    }
  }
}
