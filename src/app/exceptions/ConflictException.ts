import { HttpException } from '.';

export class ConflictException extends HttpException {
  constructor(object: any = null) {
    super(409, object);
  }
}
