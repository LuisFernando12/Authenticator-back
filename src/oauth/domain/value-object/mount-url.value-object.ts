export class MountUrlValueObject {
  static mount<T>(uri: string, params: T): URL {
    const urlRedirect = new URL(uri);
    for (const param in params) {
      urlRedirect.searchParams.append(param, params[param] as string);
    }
    return urlRedirect;
  }
}
