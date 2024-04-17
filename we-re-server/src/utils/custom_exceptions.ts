import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class CustomBadRequestException extends BadRequestException {
  constructor(message: string) {
    // TODO::에러 메시지를 좀 더 특정해서 알려주자. 인자로 뭐가 문제인지 받아옵시다.
    super({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Please check your Params again. ' + message,
      error: 'Bad Request',
    });
  }
}

export class CustomUnauthorziedException extends UnauthorizedException {
  constructor(message: string) {
    // TODO::에러 메시지를 좀 더 특정해서 알려주자. 인자로 뭐가 문제인지 받아옵시다.
    super({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Please check your Token again. ' + message,
      error: 'Unauthorized',
    });
  }
}

export class CustomNotFoundException extends NotFoundException {
  constructor(message: string) {
    super({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Please check your Path again.' + message,
      error: 'Not Found',
    });
  }
}
