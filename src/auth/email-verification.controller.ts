import {
  Body,
  Controller,
  NotAcceptableException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { EmailVerificationRequestDTO } from './dto';
import { JWTGuard } from './guards';
import { UserEntity } from '../users';

@Controller()
export class EmailVerificationController {
  constructor(private verificationService: EmailVerificationService) {}

  @Post('email-verifications')
  async verifyEmail(@Body() dto: EmailVerificationRequestDTO) {
    await this.verificationService.verifyFromToken(dto.token);

    return null;
  }

  @Post('email-verification-links')
  @UseGuards(JWTGuard)
  async resendVerificationLink(@Request() request) {
    const user = request.user as UserEntity;
    if (user.isEmailVerified) {
      throw new NotAcceptableException();
    }

    await this.verificationService.sendVerificationLink(user.email);

    return null;
  }
}
