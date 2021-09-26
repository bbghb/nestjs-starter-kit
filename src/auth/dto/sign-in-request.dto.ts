import { IsEmail, Length } from 'class-validator';

export class SignInRequestDTO {
  @IsEmail()
  email: string;

  @Length(8)
  password: string;
}
