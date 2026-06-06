interface IOauthDomainPayload {
  error: string;
  message: string;
}

type StatusCode = 404 | 401 | 403 | 400 | 409 | 500;
enum HttpStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export class AuthDomainError extends Error {
  readonly status: StatusCode;
  readonly error: string;
  constructor(errorPayload: IOauthDomainPayload, status: StatusCode) {
    super(errorPayload.message);
    this.name = 'AuthDomainError';
    this.error = errorPayload.error;
    this.status = status;
  }

  static notFound(description?: string): AuthDomainError {
    return new AuthDomainError(
      {
        error: 'not_found',
        message: description || 'Not Found !',
      },
      HttpStatus.NOT_FOUND,
    );
  }
  static unauthorized(description?: string): AuthDomainError {
    return new AuthDomainError(
      {
        error: 'unauthorized',
        message: description || 'Unauthorized !',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
  static forbidden(description?: string): AuthDomainError {
    return new AuthDomainError(
      {
        error: 'forbidden',
        message: description || 'Forbidden !',
      },
      HttpStatus.FORBIDDEN,
    );
  }
  static badRequest(description?: string): AuthDomainError {
    return new AuthDomainError(
      {
        error: 'bad_request',
        message: description || 'Bad Request !',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
  static conflict(description?: string, payload?: any): AuthDomainError {
    return new AuthDomainError(
      {
        error: 'conflict',
        message: description || 'Conflict !',
        ...payload,
      },
      HttpStatus.CONFLICT,
    );
  }
  static internalServerError(description?: string): AuthDomainError {
    return new AuthDomainError(
      {
        error: 'internal_server_error',
        message: description || 'Internal Server Error !',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
