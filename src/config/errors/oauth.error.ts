import { HttpException, HttpStatus } from '@nestjs/common';

interface IOauthErrorPayload {
  error: string;
  message?: string;
}
export class OauthError extends HttpException {
  constructor(
    errorPayload: IOauthErrorPayload,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(errorPayload, status);
  }
  static invalidRequest(description?: string): OauthError {
    return new OauthError(
      {
        error: 'invalid_request',
        message:
          description ||
          'The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed.',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
  static invalidClient(description?: string): OauthError {
    return new OauthError(
      {
        error: 'invalid_client',
        message:
          description ||
          'Client authentication failed (e.g., unknown client, no client authentication included, or unsupported authentication method).',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
  static invalidGrant(description?: string): OauthError {
    return new OauthError(
      {
        error: 'invalid_grant',
        message:
          description ||
          'The provided authorization grant is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
  static unauthorizedClient(description?: string): OauthError {
    return new OauthError(
      {
        error: 'unauthorized_client',
        message:
          description ||
          'The client is not authorized to request an authorization code using this method.',
      },
      HttpStatus.FORBIDDEN,
    );
  }
  static unsupportedGrantType(description?: string): OauthError {
    return new OauthError(
      {
        error: 'unsupported_grant_type',
        message:
          description ||
          'The authorization grant type is not supported by the authorization server.',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
