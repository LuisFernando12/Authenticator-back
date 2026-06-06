export interface ICompareHashClientSecret {
  clientSecret: string;
  clientSecretHashed: string;
  clientSecretPepper: string;
}
export const HASHED_CLIENT_SECRET_SERVICE_PORT = Symbol(
  'HASHED_CLIENT_SECRET_SERVICE_PORT',
);

export abstract class HashedClientSecretServicePort {
  abstract compareHashClientSecret({
    clientSecret,
    clientSecretHashed,
    clientSecretPepper,
  }: ICompareHashClientSecret): void;
}
