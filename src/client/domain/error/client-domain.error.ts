interface IClientDomainPayload {
  error: string;
  message: string;
}

type StatusCode = 404 | 401 | 403 | 409 | 400 | 500;
enum HttpStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  CONFLICT = 409,
}

export class ClientDomainError extends Error {
  readonly status: StatusCode;
  readonly error: string;
  constructor(errorPayload: IClientDomainPayload, status: StatusCode) {
    super(errorPayload.message);
    this.name = 'ClientDomainError';
    this.error = errorPayload.error;
    this.status = status;
  }
  static invalidRequest(description?: string): ClientDomainError {
    return new ClientDomainError(
      {
        error: 'invalid_request',
        message:
          description ||
          'The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed.',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
  static invalidClient(description?: string): ClientDomainError {
    return new ClientDomainError(
      {
        error: 'invalid_client',
        message: description || 'Client not found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
  static conflict(description?: string): ClientDomainError {
    return new ClientDomainError(
      {
        error: 'conflict',
        message: description || 'Conflict !',
      },
      HttpStatus.CONFLICT,
    );
  }
  static internalServerError(description?: string): ClientDomainError {
    return new ClientDomainError(
      {
        error: 'internal_server_error',
        message: description || 'Internal Server Error !',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
