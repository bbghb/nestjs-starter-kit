import { IsEmail, IsString, Length } from 'class-validator';
import { MatchesProperty } from '../../common';

export class SignUpRequestDTO {
  @Length(2, 50)
  firstName: string;

  @Length(2, 50)
  lastName: string;

  @IsEmail()
  email: string;

  @Length(8)
  @MatchesProperty('passwordConfirmation')
  password: string;

  @IsString()
  passwordConfirmation: string;
}
