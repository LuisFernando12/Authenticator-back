interface IOauthDomainPayload {
  error: string;
  message: string;
}

type StatusCode = 404 | 401 | 403 | 400 | 500;
enum HttpStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export class OauthDomainError extends Error {
  readonly status: StatusCode;
  readonly error: string;
  constructor(errorPayload: IOauthDomainPayload, status: StatusCode) {
    super(errorPayload.message);
    this.name = 'OauthDomainError';
    this.error = errorPayload.error;
    this.status = status;
  }
  static invalidRequest(description?: string): OauthDomainError {
    return new OauthDomainError(
      {
        error: 'invalid_request',
        message:
          description ||
          'The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed.',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
  static invalidClient(description?: string): OauthDomainError {
    return new OauthDomainError(
      {
        error: 'invalid_client',
        message:
          description ||
          'Client authentication failed (e.g., unknown client, no client authentication included, or unsupported authentication method).',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
  static invalidGrant(description?: string): OauthDomainError {
    return new OauthDomainError(
      {
        error: 'invalid_grant',
        message:
          description ||
          'The provided authorization grant is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
  static unauthorizedClient(description?: string): OauthDomainError {
    return new OauthDomainError(
      {
        error: 'unauthorized_client',
        message:
          description ||
          'The client is not authorized to request an authorization code using this method.',
      },
      HttpStatus.FORBIDDEN,
    );
  }
  static unsupportedGrantType(description?: string): OauthDomainError {
    return new OauthDomainError(
      {
        error: 'unsupported_grant_type',
        message:
          description ||
          'The authorization grant type is not supported by the authorization server.',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
  static internalServerError(description?: string): OauthDomainError {
    return new OauthDomainError(
      {
        error: 'internal_server_error',
        message: description || 'Internal Server Error !',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
