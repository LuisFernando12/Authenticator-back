export class ScopeValueObject {
  constructor(private readonly scopes: Array<string>) {}
  static create(value: string) {
    const scope = value.split(' ').map((scope) => scope.trim());
    if (scope.length === 0) {
      throw new Error('Scope is required');
    }
    return new ScopeValueObject([...new Set(scope)]);
  }
  toString() {
    return this.scopes.join(' ');
  }
  constains(scopes: Array<string>) {
    return scopes.some((scope) => this.scopes.includes(scope));
  }
}
