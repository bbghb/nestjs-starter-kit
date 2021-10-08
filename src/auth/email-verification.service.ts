import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users';
import { VerificationTokenPayload } from './interfaces';
import { ConfigService } from '../config';
import { MailsService } from '../mails';


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
    const { email } = await this.jwtService.verifyAsync<VerificationTokenPayload>(token);
    const user = await this.usersService.findByEmail(email);

    if (!user || user.isEmailVerified) {
      throw new BadRequestException();
    }

    return this.usersService.verifyEmail(email);
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
}
