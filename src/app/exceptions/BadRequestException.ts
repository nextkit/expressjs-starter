import { HttpException } from '.';

export class BadRequestException extends HttpException {
  constructor(obj: any = null) {
    super(400, obj);
  }
}
