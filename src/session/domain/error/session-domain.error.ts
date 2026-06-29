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
export class SessionDomainError extends Error {
  readonly status: HttpStatus;
  readonly error: string;
  constructor(errorPayload: IDomainError, status: HttpStatus) {
    super(errorPayload.message);
    this.name = 'SessionDomainError';
    this.error = errorPayload.error;
    this.status = status;
  }
  static notFound(description?: string): SessionDomainError {
    return new SessionDomainError(
      {
        error: 'not_found',
        message: description || 'Not Found !',
      },
      HttpStatus.NOT_FOUND,
    );
  }
  static unauthorized(description?: string): SessionDomainError {
    return new SessionDomainError(
      {
        error: 'unauthorized',
        message: description || 'Unauthorized !',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
  static forbidden(description?: string): SessionDomainError {
    return new SessionDomainError(
      {
        error: 'forbidden',
        message: description || 'Forbidden !',
      },
      HttpStatus.FORBIDDEN,
    );
  }
  static badRequest(description?: string): SessionDomainError {
    return new SessionDomainError(
      {
        error: 'bad_request',
        message: description || 'Bad Request !',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
  static internalServerError(description?: string): SessionDomainError {
    return new SessionDomainError(
      {
        error: 'internal_server_error',
        message: description || 'Internal Server Error !',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
