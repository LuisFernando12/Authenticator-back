import { randomUUID } from 'node:crypto';
import { GenerateJtiPort } from '../../application/port/generate-jti.port';

export class GenerateJtiAdapter implements GenerateJtiPort {
  generate(): string {
    return randomUUID();
  }
}
