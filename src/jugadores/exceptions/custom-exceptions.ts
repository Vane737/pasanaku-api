

import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super({ status: HttpStatus.BAD_REQUEST, error: message, error_code: 'BAD_REQUEST' }, HttpStatus.BAD_REQUEST);
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super({ status: HttpStatus.NOT_FOUND, error: message, error_code: 'NOT_FOUND' }, HttpStatus.NOT_FOUND);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: string) {
    super({ status: HttpStatus.INTERNAL_SERVER_ERROR, error: message, error_code: 'INTERNAL_SERVER_ERROR' }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}