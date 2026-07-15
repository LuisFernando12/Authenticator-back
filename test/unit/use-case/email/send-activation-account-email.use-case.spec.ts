import { SendActivationAccountEmailUseCase } from '@/email/application/use-cases/send-activation-account-email.use-case';
import { EmailDomainError } from '@/email/domain/error/email-domain.error';
import { emailMocked, EmailMockedType } from './mock/index.mock';

describe('SendActivationAccountEmailUseCase', () => {
  let sendActivationAccountEmailUseCase: SendActivationAccountEmailUseCase;
  let emailMock: EmailMockedType;

  beforeEach(() => {
    emailMock = emailMocked();
    jest.clearAllMocks();
    sendActivationAccountEmailUseCase = new SendActivationAccountEmailUseCase(
      emailMock.mailerServiceFake,
      emailMock.configServiceFake,
      emailMock.emailLoggerFake,
    );
  });

  it('should be defined', () => {
    expect(sendActivationAccountEmailUseCase).toBeDefined();
  });

  it('should send an activation account email', async () => {
    const email = emailMock.mockEmail({
      email: 'john.doe@example.com',
      username: 'John Doe',
      token: 'activation-token',
    });

    const result = await sendActivationAccountEmailUseCase.execute(email);

    expect(result).toBeUndefined();
  });

  it('should call mailer service with activation template', async () => {
    const sendMailSpy = jest.spyOn(emailMock.mailerServiceFake, 'sendMail');
    const email = emailMock.mockEmail({
      email: 'john.doe@example.com',
      username: 'John Doe',
      token: 'activation-token',
    });

    await sendActivationAccountEmailUseCase.execute(email);

    expect(sendMailSpy).toHaveBeenCalledWith({
      to: 'john.doe@example.com',
      subject: 'Email de ativação',
      template: './activeAccount',
      context: {
        username: 'John Doe',
        activeUrl:
          'https://auth.example.com/active-account/?token=activation-token',
      },
    });
  });

  it('should throw an email domain error if activation email fails', async () => {
    jest
      .spyOn(emailMock.mailerServiceFake, 'sendMail')
      .mockRejectedValueOnce(new Error('SMTP unavailable'));
    const email = emailMock.mockEmail({
      email: 'john.doe@example.com',
      username: 'John Doe',
      token: 'activation-token',
    });

    const promise = sendActivationAccountEmailUseCase.execute(email);

    await expect(promise).rejects.toBeInstanceOf(EmailDomainError);
    await expect(promise).rejects.toThrow(
      'Failure to send email for activation account ',
    );
  });
});
