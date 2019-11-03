import { HttpException } from '.';

export class InternalServerErrorException extends HttpException {
  constructor(obj: any = null) {
    super(500, obj);
  }
}
