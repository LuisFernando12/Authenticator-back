export const GENERATE_OTP_SERVICE_PORT = Symbol('GENERATE_OTP_SERVICE_PORT');
export abstract class GenerateOtpServicePort {
  abstract generateOTP(): number;
}
