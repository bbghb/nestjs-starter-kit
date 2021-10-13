import { Body, Controller, Post, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from '../users';
import { PasswordResetsService } from './password-resets.service';
import { PasswordResetLinkRequestDTO, PasswordResetRequestDTO } from './dto';

export const EMAIL_NOT_FOUND_ERROR = 'EMAIL_NOT_FOUND';
export const INVALID_RESET_CODE_ERROR = 'INVALID_RESET_CODE';

@Controller()
export class PasswordResetsController {
  constructor(
    private usersService: UsersService,
    private passwordResetsService: PasswordResetsService,
  ) {}

  @Post('password-reset-links')
  async sendResetLink(@Body() dto: PasswordResetLinkRequestDTO) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnprocessableEntityException({
        errors: {
          email: [EMAIL_NOT_FOUND_ERROR]
        }
      });
    }

    await this.passwordResetsService.sendResetLink(user);

    return null;
  }

  @Post('password-resets')
  async resetPassword(@Body() dto: PasswordResetRequestDTO) {
    const { code, password } = dto;

    try {
      await this.passwordResetsService.resetPassword(code, password);
    } catch (e) {
      throw new UnprocessableEntityException({
        errors: {
          code: [INVALID_RESET_CODE_ERROR]
        },
      });
    }

    return null;
  }
}
