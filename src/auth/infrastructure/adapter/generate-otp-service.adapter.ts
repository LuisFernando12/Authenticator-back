import { randomInt } from 'node:crypto';
import { GenerateOtpServicePort } from '../../application/port/generate-otp-service.port';

export class GenerateOtpServiceAdapter implements GenerateOtpServicePort {
  generateOTP(): number {
    return randomInt(100000, 999999);
  }
}
