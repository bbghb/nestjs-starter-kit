import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PasswordResetEntity } from './password-reset.entity';
import { PasswordResetsService } from './password-resets.service';
import { PasswordResetsController } from './password-resets.controller';
import { UsersModule } from '../users';
import { MailsModule } from '../mails';
import { ConfigModule, ConfigService } from '../config';

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordResetEntity]),
    UsersModule,
    MailsModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('auth.jwt.secret'),
        signOptions: {
          expiresIn: configService.get('auth.passwordResets.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [PasswordResetsService],
  exports: [
    TypeOrmModule,
    PasswordResetsService,
  ],
  controllers: [PasswordResetsController],
})
export class PasswordResetsModule {}
