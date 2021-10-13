import { IsEmail } from 'class-validator';

export class PasswordResetLinkRequestDTO {
  @IsEmail()
  email: string;
}
