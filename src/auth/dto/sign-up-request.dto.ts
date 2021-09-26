import { IsEmail, IsString, Length } from 'class-validator';
import { SameAs } from '../../common';

export class SignUpRequestDTO {
  @Length(2, 50)
  firstName: string;

  @Length(2, 50)
  lastName: string;

  @IsEmail()
  email: string;

  @SameAs('passwordConfirmation')
  @Length(8)
  password: string;

  @IsString()
  passwordConfirmation: string;
}
