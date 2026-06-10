export const GENERATE_JTI_PORT = Symbol('GENERATE_JTI_PORT');

export abstract class GenerateJtiPort {
  abstract generate(): string;
}
