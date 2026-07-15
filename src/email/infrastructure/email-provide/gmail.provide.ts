import { OnModuleInit } from '@nestjs/common';
import { google } from 'googleapis';
import { AppConfigEnvService } from '../../../core/domain/service/app-config-env.service';
import { EmailDomainError } from '../../domain/error/email-domain.error';
import { EmailProvide, ISendEmail } from './email.provide';

export class GmailProvide implements EmailProvide, OnModuleInit {
  private oauth2Client;
  constructor(private readonly configService: AppConfigEnvService) {}
  onModuleInit() {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.gmailClientId,
      this.configService.gmailClientSecret,
      this.configService.gmailRedirectURI,
    );
    this.oauth2Client.setCredentials({
      refresh_token: this.configService.gmailRefreshToken,
    });
  }

  async sendMail(payload: ISendEmail) {
    try {
      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
      const utf8Subject = `=?utf-8?B?${Buffer.from(payload.subject).toString('base64')}?=`;
      const messageParts = [
        `From: ${process.env.GMAIL_SENDER_EMAIL}`,
        `To: ${payload.to}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        payload.htmlTemplate,
      ];
      const message = messageParts.join('\n');
      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });
    } catch {
      throw EmailDomainError.internalServerError('Failure to send email');
    }
  }
}
