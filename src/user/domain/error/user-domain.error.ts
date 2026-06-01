interface IUserDomainErrorPayload {
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

export class UserDomainError extends Error {
  readonly status: StatusCode;
  readonly error: string;
  constructor(errorPayload: IUserDomainErrorPayload, status: StatusCode) {
    super(errorPayload.message);
    this.name = 'UserDomainError';
    this.error = errorPayload.error;
    this.status = status;
  }
  static badRequest(description?: string): UserDomainError {
    return new UserDomainError(
      {
        error: 'bad_request',
        message: description || 'Bad Request!',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
  static conflict(description?: string): UserDomainError {
    return new UserDomainError(
      {
        error: 'conflict',
        message: description || 'Conflict!',
      },
      HttpStatus.CONFLICT,
    );
  }

  static internalServerError(description?: string): UserDomainError {
    return new UserDomainError(
      {
        error: 'internal_server_error',
        message: description || 'Internal Server Error !',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
