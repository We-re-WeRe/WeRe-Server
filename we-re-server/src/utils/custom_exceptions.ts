import {
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class CustomBadTypeRequestException extends BadRequestException {
  constructor(variableName: string, variable: any) {
    // TODO::에러 메시지를 좀 더 특정해서 알려주자. 인자로 뭐가 문제인지 받아옵시다.

    super({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Please check your Params or Body type again.',
      error: 'Bad Request',
      cause: `${variableName} should be ${typeof variable} type.`,
    });
  }
}

export class CustomDataAlreadyExistException extends BadRequestException {
  constructor(cause?: string) {
    // TODO::에러 메시지를 좀 더 특정해서 알려주자. 인자로 뭐가 문제인지 받아옵시다.

    super({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Data is already exist.',
      error: 'Bad Request',
      cause,
    });
  }
}

export class CustomUnauthorziedException extends UnauthorizedException {
  constructor(cause: string) {
    // TODO::에러 메시지를 좀 더 특정해서 알려주자. 인자로 뭐가 문제인지 받아옵시다.
    super({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Please check your Token again.',
      error: 'Unauthorized',
      cause,
    });
  }
}

export class CustomNotFoundException extends NotFoundException {
  constructor(variableName: string) {
    super({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Please check your Path or Params value again.',
      error: 'Not Found',
      cause: `${variableName} is not found`,
    });
  }
}

export class CustomDataBaseException extends InternalServerErrorException {
  constructor(cause: string) {
    super({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Something wrong in database connection.',
      error: 'Internal Server Error',
      cause,
    });
  }
}
