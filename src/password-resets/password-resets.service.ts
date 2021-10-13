import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { PasswordResetEntity } from './password-reset.entity';
import { InvalidResetCodeException } from './exceptions';
import { ConfigService } from '../config';
import { UserEntity, UsersService } from '../users';
import { MailsService } from '../mails';

@Injectable()
export class PasswordResetsService {
  constructor(
    @InjectRepository(PasswordResetEntity)
    private resets: Repository<PasswordResetEntity>,
    private mailsService: MailsService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async sendResetLink(user: UserEntity) {
    const [code, reset] = await Promise.all([
      this.createResetCode(user.id),
      this.resets.findOne({ user }),
    ]);

    if (reset) {
      await this.resets.update({ user }, { code });
    } else {
      await this.resets.save({ user, code });
    }

    return this.mailsService.sendPasswordResetMail({
      email: user.email,
      firstName: user.firstName,
      link: this.createResetLink(code),
    });
  }

  async resetPassword(code: string, password: string) {
    const reset = await this.getResetFromCode(code);

    if (!reset || reset.code !== code) {
      throw new InvalidResetCodeException();
    }

    await this.usersService.updatePassword(reset.user.id, password);
    await this.resets.delete({ id: reset.id });
  }

  private createResetLink(code: string) {
    const baseURL = this.configService.get('auth.passwordResets.url');
    return `${baseURL}?code=${code}`;
  }

  private createResetCode(id: number) {
    const signOptions = {
      expiresIn: this.configService.get('auth.passwordResets.expiresIn'),
    };

    return this.jwtService.signAsync({ id }, signOptions);
  }

  private getResetFromCode(code: string) {
    return this.jwtService
      .verifyAsync<{ id: number }>(code)
      .then(({ id }) =>
        this.resets.findOne({ where: { userId: id }, relations: ['user'] }),
      )
      .catch(() => null);
  }
}
