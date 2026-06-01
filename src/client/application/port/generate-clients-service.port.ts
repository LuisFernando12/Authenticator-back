export const GENERATE_CLIENTS_SERVICE_PORT = Symbol(
  'GENERATE_CLIENTS_SERVICE_PORT',
);

export abstract class GenerateClientsServicePort {
  abstract generateClientId(name: string): string;
  abstract generateClientSecret(pepper: string): Promise<{
    clientSecretPlainText: string;
    clientSecretHashed: string;
  }>;
}
