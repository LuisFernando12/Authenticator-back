export abstract class BaseUseCase<T, R> {
  abstract execute(payload: T): Promise<R>;
}
