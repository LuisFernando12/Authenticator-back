import { randomUUID } from 'node:crypto';
import { GenerateUUIDPort } from '../../application/port/generate-uuid.port';

export class GenerateUUIDAdapter implements GenerateUUIDPort {
  generate(): string {
    return randomUUID();
  }
}
