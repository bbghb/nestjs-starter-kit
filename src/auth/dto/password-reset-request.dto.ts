import { IsNotEmpty, Length } from 'class-validator';
import { MatchesProperty } from '../../common';

export class PasswordResetRequestDTO {
  @IsNotEmpty()
  code: string;

  @MatchesProperty('passwordConfirmation')
  @Length(8)
  password: string;

  passwordConfirmation: string;
}
