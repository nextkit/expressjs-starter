import { HttpException } from '.';

export class ForbiddenException extends HttpException {
  constructor(obj: any = null) {
    super(403, obj);
  }
}
