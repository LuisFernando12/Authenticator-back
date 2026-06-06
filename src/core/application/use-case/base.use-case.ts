export abstract class BaseUseCase<T> {
  abstract execute(payload: T): Promise<any>;
}
