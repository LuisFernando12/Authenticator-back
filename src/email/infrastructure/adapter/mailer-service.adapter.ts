import { InternalServerErrorException } from '@nestjs/common';
import {
  ISendEmailPayload,
  MailerServicePort,
} from '../../application/port/mailer-service.port';
import { EmailProvide } from '../email-provide/email.provide';
import { HandlebarsRender } from '../templates/handlebars.render';

export class MailerServiceAdapter implements MailerServicePort {
  constructor(
    private readonly mailerProvide: EmailProvide,
    private readonly handlebarsRender: HandlebarsRender,
  ) {}
  async sendMail(payload: ISendEmailPayload): Promise<void> {
    try {
      const { to, subject, template, from } = payload;
      const htmlTemplate = await this.handlebarsRender.renderTemplate(
        template,
        payload.context,
      );
      await this.mailerProvide.sendMail({
        from: from,
        to: to,
        subject: subject,
        htmlTemplate: htmlTemplate,
      });
    } catch {
      throw new InternalServerErrorException('Failure to send email');
    }
  }
}
