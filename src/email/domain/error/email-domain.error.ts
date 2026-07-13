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
export class EmailDomainError extends Error {
  readonly status: HttpStatus;
  readonly error: string;
  constructor(errorPayload: IDomainError, status: HttpStatus) {
    super(errorPayload.message);
    this.name = 'EmailDomainError';
    this.error = errorPayload.error;
    this.status = status;
  }
  static notFound(description?: string): EmailDomainError {
    return new EmailDomainError(
      {
        error: 'not_found',
        message: description || 'Not Found !',
      },
      HttpStatus.NOT_FOUND,
    );
  }
  static unauthorized(description?: string): EmailDomainError {
    return new EmailDomainError(
      {
        error: 'unauthorized',
        message: description || 'Unauthorized !',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
  static forbidden(description?: string): EmailDomainError {
    return new EmailDomainError(
      {
        error: 'forbidden',
        message: description || 'Forbidden !',
      },
      HttpStatus.FORBIDDEN,
    );
  }
  static badRequest(description?: string): EmailDomainError {
    return new EmailDomainError(
      {
        error: 'bad_request',
        message: description || 'Bad Request !',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
  static internalServerError(description?: string): EmailDomainError {
    return new EmailDomainError(
      {
        error: 'internal_server_error',
        message: description || 'Internal Server Error !',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
