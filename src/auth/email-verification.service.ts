import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users';
import { VerificationTokenPayload } from './interfaces';
import { ConfigService } from '../config';


@Injectable()
export class EmailVerificationService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private mailer: MailerService,
    private config: ConfigService,
  ) {}

  async sendVerificationLink(email: string) {
    const token = await this.createVerificationToken(email);
    const link = this.createVerificationLink(token);
    const { firstName } = await this.usersService.findByEmail(email);

    return this.mailer.sendMail({
      to: email,
      subject: 'Verify Email Address',
      template: './email-verification',
      context: {
        firstName,
        link,
      }
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
    const signOptions = { expiresIn: this.config.get('auth.emailVerification.expiresIn') };

    return this.jwtService.signAsync(
      { email },
      signOptions
    );
  }

  private createVerificationLink(token: string) {
    return `${this.config.get('auth.emailVerification.url')}?token=${token}`;
  }
}
