interface IDomainError {
  error: string;
  message: string;
}
enum HttpStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
export class ConsentDomainError extends Error {
  readonly status: HttpStatus;
  readonly error: string;
  constructor(erroPayload: IDomainError, status: HttpStatus) {
    super(erroPayload.message);
    this.name = 'ConsentDomainError';
    this.error = erroPayload.error;
    this.status = status;
  }
  static notFound(description?: string): ConsentDomainError {
    return new ConsentDomainError(
      {
        error: 'not_found',
        message: description || 'Not Found !',
      },
      HttpStatus.NOT_FOUND,
    );
  }
  static unauthorized(description?: string): ConsentDomainError {
    return new ConsentDomainError(
      {
        error: 'unauthorized',
        message: description || 'Unauthorized !',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
  static forbidden(description?: string): ConsentDomainError {
    return new ConsentDomainError(
      {
        error: 'forbidden',
        message: description || 'Forbidden !',
      },
      HttpStatus.FORBIDDEN,
    );
  }
  static badRequest(description?: string): ConsentDomainError {
    return new ConsentDomainError(
      {
        error: 'bad_request',
        message: description || 'Bad Request !',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
  static internalServerError(description?: string): ConsentDomainError {
    return new ConsentDomainError(
      {
        error: 'internal_server_error',
        message: description || 'Internal Server Error !',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
