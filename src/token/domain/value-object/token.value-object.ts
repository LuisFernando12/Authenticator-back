export class TokenValueObject {
  constructor() {}
  static getSecondsByDays(days: number): number {
    return days * (24 * 60 * 60);
  }
  static generateExpireAt(seconds: number): number {
    const expiresAt = new Date(Date.now() + seconds * 1000);
    return Math.floor(expiresAt.valueOf() / 1000);
  }
}
