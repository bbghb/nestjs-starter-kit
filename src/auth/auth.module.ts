import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy, JWTStrategy } from './strategies';
import { ConfigModule, ConfigService } from '../config';
import { EmailVerificationService } from './email-verification.service';
import { EmailVerificationController } from './email-verification.controller';
import { MailsModule } from '../mails';

function jwtOptionsFactory(configService: ConfigService): JwtModuleOptions {
  const config = configService.get('auth.jwt');

  return {
    secret: config.secret,
    signOptions: {
      expiresIn: config.expiresIn,
    },
  };
}

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: jwtOptionsFactory,
      inject: [ConfigService],
    }),
    MailsModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JWTStrategy,
    EmailVerificationService,
  ],
  controllers: [
    AuthController,
    EmailVerificationController,
  ],
})
export class AuthModule {}
