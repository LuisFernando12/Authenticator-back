interface IDomainErrorPayload {
  error: string;
  message: string;
}

type StatusCode = 404 | 401 | 403 | 400 | 409 | 500;
enum HttpStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  CONFLICT = 409,
}

export class TokenDomainError extends Error {
  readonly status: StatusCode;
  readonly error: string;
  constructor(errorPayload: IDomainErrorPayload, status: StatusCode) {
    super(errorPayload.message);
    this.name = 'TokenDomainError';
    this.error = errorPayload.error;
    this.status = status;
  }
  static badRequest(description?: string): TokenDomainError {
    return new TokenDomainError(
      {
        error: 'bad_request',
        message: description || 'Bad Request!',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
  static notFound(description?: string) {
    return new TokenDomainError(
      {
        error: 'not_found',
        message: description || 'Token Not Found!',
      },
      HttpStatus.NOT_FOUND,
    );
  }
  static unauthorized(description?: string) {
    return new TokenDomainError(
      {
        error: 'unauthorized',
        message: description || 'Unauthorized!',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
  static internalServerError(description?: string): TokenDomainError {
    return new TokenDomainError(
      {
        error: 'internal_server_error',
        message: description || 'Internal Server Error !',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
