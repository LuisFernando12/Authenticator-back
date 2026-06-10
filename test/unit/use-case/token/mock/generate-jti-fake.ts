import { GenerateJtiPort } from '@/token/application/port/generate-jti.port';

export class GenerateJtiFake implements GenerateJtiPort {
  generate(): string {
    return 'test-jti';
  }
}
