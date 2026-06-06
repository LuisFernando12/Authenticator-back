export class RedirectUriValueObject {
  constructor(private readonly value: string) {}
  static create(value: string) {
    const uri = new URL(value);
    if (!uri.protocol || !uri.pathname) {
      throw new Error('Invalid URI!');
    }
    return new RedirectUriValueObject(uri.toString());
  }
  equals(uri: string | RedirectUriValueObject) {
    const value =
      typeof uri === 'string'
        ? RedirectUriValueObject.create(uri).value
        : uri.value;
    return this.value === value;
  }
}
