import { HttpException } from './HttpException';

export class UnauthorizedException extends HttpException {
  constructor(obj: any = null) {
    super(401, obj);
  }
}
