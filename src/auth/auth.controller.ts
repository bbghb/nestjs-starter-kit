import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { SignInRequestDTO, SignUpRequestDTO } from './dto';
import { UsersService, UserEntity } from '../users';
import { AuthResponseDTO } from './dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards';
import { EmailVerificationService } from './email-verification.service';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private verificationService: EmailVerificationService,
  ) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(
    @Body() dto: SignInRequestDTO,
    @Request() request,
  ): Promise<AuthResponseDTO> {
    const { id, email, firstName, lastName } = request.user as UserEntity;
    const token = await this.authService.createToken({ id });

    return {
      token,
      user: { id, email, firstName, lastName },
    };
  }

  @Post('register')
  async register(@Body() dto: SignUpRequestDTO): Promise<AuthResponseDTO> {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { passwordConfirmation, ...data } = dto;
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const { id, email, firstName, lastName } = await this.usersService.create(
      data,
    );
    const token = await this.authService.createToken({ id });
    await this.verificationService.sendVerificationLink(email);

    return {
      token,
      user: { id, email, firstName, lastName },
    };
  }
}
