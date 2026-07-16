export interface ISessionProps {
  id?: string;
  jti: string;
  userId: string;
  consentId: string | null;
  tokenFamilyId: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
export class Session {
  constructor(private readonly sessionProps: ISessionProps) {}
  get id(): string {
    return this.sessionProps.id;
  }
  get jti(): string {
    return this.sessionProps.jti;
  }
  get userId(): string {
    return this.sessionProps.userId;
  }
  get consentId(): string | null {
    return this.sessionProps.consentId;
  }
  get tokenFamilyId(): string {
    return this.sessionProps.tokenFamilyId;
  }
  get expiresAt(): Date {
    return this.sessionProps.expiresAt;
  }
  get createdAt(): Date {
    return this.sessionProps.createdAt;
  }
  get updatedAt(): Date {
    return this.sessionProps.updatedAt;
  }
  static create(sessionProps: ISessionProps): Session {
    return new Session(sessionProps);
  }
  toJSON(): ISessionProps {
    return {
      id: this.id,
      jti: this.jti,
      userId: this.userId,
      consentId: this.consentId,
      tokenFamilyId: this.tokenFamilyId,
      expiresAt: this.expiresAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
