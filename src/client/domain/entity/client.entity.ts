export interface IClientProps {
  id?: string;
  clientId: string;
  clientSecret?: string;
  isConfidential: boolean;
  name: string;
  redirectUris: Array<string>;
  grantTypes: Array<string>;
  scopes: Array<string>;
  isActive: boolean;
  createdAt?: Date;
}

export class Client {
  constructor(private readonly props: IClientProps) {}
  get id() {
    return this.props.id;
  }
  get clientId(): string {
    return this.props.clientId;
  }
  get clientSecret(): string {
    return this.props.clientSecret;
  }
  get isConfidential(): boolean {
    return this.props.isConfidential;
  }
  get name(): string {
    return this.props.name;
  }
  get redirectUris(): Array<string> {
    return this.props.redirectUris;
  }
  get grantTypes(): Array<string> {
    return this.props.grantTypes;
  }
  get scopes(): Array<string> {
    return this.props.scopes;
  }
  get isActive(): boolean {
    return this.props.isActive;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  set clientSecret(clientSecret: string) {
    this.props.clientSecret = clientSecret;
  }
  set isActive(isActive: boolean) {
    this.props.isActive = isActive;
  }
  static create(props: IClientProps) {
    return new Client(props);
  }
  hiddenClientSecret(): void {
    this.props.clientSecret =
      (!!this.props.clientSecret &&
        this.props.clientSecret.replace(/./g, '*')) ||
      undefined;
  }
  toJSON(): IClientProps {
    return {
      name: this.name,
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      isConfidential: this.isConfidential,
      redirectUris: this.redirectUris,
      grantTypes: this.grantTypes,
      scopes: this.scopes,
      isActive: this.isActive,
      createdAt: this.createdAt,
    };
  }
}
