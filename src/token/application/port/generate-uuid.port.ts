export const GENERATE_JTI_PORT = Symbol('GENERATE_JTI_PORT');

export abstract class GenerateUUIDPort {
  abstract generate(): string;
}
