import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserEntity } from '../users';
import { EmailVerificationService } from './email-verification.service';
import { EmailVerificationRequestDTO } from './dto';
import { JWTGuard } from './guards';

@Controller()
export class EmailVerificationController {
  constructor(private verificationService: EmailVerificationService) {}

  @Post('email-verifications')
  async verifyEmail(@Body() dto: EmailVerificationRequestDTO) {
    const isVerified = await this.verificationService.verifyFromToken(
      dto.token,
    );

    if (!isVerified) {
      throw new InternalServerErrorException();
    }

    return null;
  }

  @UseGuards(JWTGuard)
  @Post('email-verification-links')
  async resendVerificationLink(@Request() request) {
    const user = request.user as UserEntity;

    if (user.isEmailVerified) {
      throw new BadRequestException();
    }

    return this.verificationService.sendVerificationLink(user.email);
  }
}
