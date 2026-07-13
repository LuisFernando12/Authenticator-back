import { MailerService } from '@nestjs-modules/mailer';
import { InternalServerErrorException } from '@nestjs/common';
import {
  ISendEmailPayload,
  MailerServicePort,
} from '../../application/port/mailer-service.port';

export class MailerServiceAdapter implements MailerServicePort {
  constructor(private readonly mailerService: MailerService) {}
  async sendMail(payload: ISendEmailPayload): Promise<void> {
    try {
      const { to, subject, template, context, from } = payload;
      await this.mailerService.sendMail({
        from: from,
        to: to,
        subject: subject,
        template: template,
        context: context,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failure to send email', {
        cause: error,
      });
    }
  }
}
