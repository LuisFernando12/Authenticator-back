import { SendResetPasswordEmailUseCase } from '@/email/application/use-cases/send-reset-password-email';
import { EmailDomainError } from '@/email/domain/error/email-domain.error';
import { emailMocked, EmailMockedType } from './mock/index.mock';

describe('SendResetPasswordEmailUseCase', () => {
  let sendResetPasswordEmailUseCase: SendResetPasswordEmailUseCase;
  let emailMock: EmailMockedType;

  beforeEach(() => {
    emailMock = emailMocked();
    jest.clearAllMocks();
    sendResetPasswordEmailUseCase = new SendResetPasswordEmailUseCase(
      emailMock.mailerServiceFake,
      emailMock.configServiceFake,
      emailMock.emailLoggerFake,
    );
  });

  it('should be defined', () => {
    expect(sendResetPasswordEmailUseCase).toBeDefined();
  });

  it('should send a reset password email', async () => {
    const email = emailMock.mockEmail({
      email: 'john.doe@example.com',
      username: 'John Doe',
      code: 123_456,
    });

    const result = await sendResetPasswordEmailUseCase.execute(email);

    expect(result).toBeUndefined();
  });

  it('should call mailer service with reset password template', async () => {
    const sendMailSpy = jest.spyOn(emailMock.mailerServiceFake, 'sendMail');
    const email = emailMock.mockEmail({
      email: 'john.doe@example.com',
      username: 'John Doe',
      code: 123_456,
    });

    await sendResetPasswordEmailUseCase.execute(email);

    expect(sendMailSpy).toHaveBeenCalledWith({
      to: 'john.doe@example.com',
      subject: 'Recuperação de senha',
      template: './resetPassword',
      context: {
        username: 'John Doe',
        resetPasswordURL: 'https://auth.example.com/reset-password',
        code: '123456',
      },
    });
  });

  it('should throw an email domain error if reset password email fails', async () => {
    jest
      .spyOn(emailMock.mailerServiceFake, 'sendMail')
      .mockRejectedValueOnce(new Error('SMTP unavailable'));
    const email = emailMock.mockEmail({
      email: 'john.doe@example.com',
      username: 'John Doe',
      code: 123_456,
    });

    const promise = sendResetPasswordEmailUseCase.execute(email);

    await expect(promise).rejects.toBeInstanceOf(EmailDomainError);
    await expect(promise).rejects.toThrow(
      'Failure to send reset password email',
    );
  });
});
