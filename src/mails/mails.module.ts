import { Module } from '@nestjs/common';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService, ConfigModule } from '../config';
import { MailsService } from './mails.service';

function mailerOptionsFactory(configService: ConfigService): MailerOptions {
  const config = configService.get('mail');
  const { host, port, from } = config;
  const { user, password: pass } = config.auth;
  const auth = user ? { user, pass } : null;

  return {
    transport: {
      host,
      port,
      secure: false,
      auth,
    },
    defaults: {
      from,
    },
    template: {
      dir: `${__dirname}/templates`,
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
}

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mailerOptionsFactory,
      inject: [ConfigService],
    }),
  ],
  providers: [MailsService],
  exports: [MailsService],
})
export class MailsModule {}
