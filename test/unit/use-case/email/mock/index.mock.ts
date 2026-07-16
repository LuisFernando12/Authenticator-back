import { Email, EmailProps } from '@/email/domain/entity/email.entity';
import { ConfigServiceFake } from './config-service-fake';
import { EmailLoggerFake } from './email-logger-fake';
import { MailerServiceFake } from './mailer-service-fake';

export const emailMocked = () => ({
  mailerServiceFake: new MailerServiceFake(),
  configServiceFake: new ConfigServiceFake(),
  emailLoggerFake: new EmailLoggerFake(),
  mockEmail: (email: EmailProps) => new Email(email),
});

export type EmailMockedType = ReturnType<typeof emailMocked>;
