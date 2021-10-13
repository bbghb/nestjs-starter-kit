import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailsService {
  constructor(private mailer: MailerService) {}

  sendEmailVerificationMail(payload: {
    email: string;
    firstName: string;
    link: string;
  }) {
    const { email, firstName, link } = payload;

    return this.mailer.sendMail({
      to: email,
      template: './email-verification',
      context: {
        firstName,
        link,
      },
    });
  }

  sendPasswordResetMail(payload: {
    email: string;
    firstName: string;
    link: string;
  }) {
    const { email, firstName, link } = payload;

    return this.mailer.sendMail({
      to: email,
      template: './password-reset',
      context: {
        firstName,
        link,
      },
    });
  }
}
