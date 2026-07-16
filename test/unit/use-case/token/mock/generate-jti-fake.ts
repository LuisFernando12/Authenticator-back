import { GenerateUUIDPort } from '@/token/application/port/generate-uuid.port';

export class GenerateUUIDFake implements GenerateUUIDPort {
  generate(): string {
    return 'test-jti';
  }
}
