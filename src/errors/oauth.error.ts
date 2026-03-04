import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
} from '@nestjs/common';

export class OauthError extends HttpException {
  constructor(
    objectOrError?: any,
    descriptionOrOptions:
      | string
      | HttpExceptionOptions = 'Oauth Error Exception',
  ) {
    const { description, httpExceptionOptions } =
      HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);
    super(
      HttpException.createBody(
        objectOrError,
        description,
        HttpStatus.UNAUTHORIZED,
      ),
      HttpStatus.UNAUTHORIZED,
      httpExceptionOptions,
    );
  }
}
