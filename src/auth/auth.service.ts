import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users';
import { TokenPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  verifyCredentials(email: string, password: string) {
    return this.usersService.findByEmailAndPassword(email, password);
  }

  createToken(payload: TokenPayload) {
    return this.jwtService.signAsync(payload);
  }

  getUserFromTokenPayload(payload: TokenPayload) {
    return this.usersService.findById(payload.id);
  }
}
