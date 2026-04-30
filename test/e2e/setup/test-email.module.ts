import { handlebarsSplitCharsHelper } from '@/config/helper/handlebars-split-chars.healper';
import { EmailService } from '@/service/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'localhost',
        port: 1025,
      },
      template: {
        dir: join(process.cwd(), '/src/templates'),
        adapter: new HandlebarsAdapter(handlebarsSplitCharsHelper),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [
    {
      provide: EmailService,
      useValue: {
        sendActivationEmail: jest.fn(),
        resetPassword: jest.fn(),
      },
    },
  ],
  exports: [EmailService],
})
export class TestEmailModule {}
