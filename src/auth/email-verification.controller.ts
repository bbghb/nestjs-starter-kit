import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserEntity } from '../users';
import { EmailVerificationService } from './email-verification.service';
import { EmailVerificationRequestDTO } from './dto';
import { JWTGuard, UnverifiedEmailGuard } from './guards';

@Controller()
export class EmailVerificationController {
  constructor(private verificationService: EmailVerificationService) {}

  @Post('email-verifications')
  async verifyEmail(@Body() dto: EmailVerificationRequestDTO) {
    await this.verificationService.verifyFromToken(dto.token);

    return null;
  }

  @UseGuards(JWTGuard, UnverifiedEmailGuard)
  @Post('email-verification-links')
  async resendVerificationLink(@Request() request) {
    const user = request.user as UserEntity;
    await this.verificationService.sendVerificationLink(user.email);

    return null;
  }
}
