import { Module } from '@nestjs/common';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService, ConfigModule } from '../config';

function mailerOptionsFactory(configService: ConfigService): MailerOptions {
  return {
    transport: {
      host: configService.get('mail.host'),
      port: configService.get('mail.port'),
      secure: false,
      auth: {
        user: configService.get('mail.auth.user'),
        pass: configService.get('mail.auth.password'),
      },
    },
    defaults: {
      from: configService.get('mail.from'),
    },
    template: {
      dir: `${__dirname}/templates`,
      adapter: new HandlebarsAdapter(),
    },
  };
}

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mailerOptionsFactory,
      inject: [ConfigService],
    })
  ],
  exports: [MailerModule]
})
export class MailsModule {}
