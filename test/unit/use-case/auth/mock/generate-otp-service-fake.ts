import { GenerateOtpServicePort } from '@/auth/application/port/generate-otp-service.port';

export class GenerateOtpServiceFake implements GenerateOtpServicePort {
  generateOTP(): number {
    return 123456;
  }
}
