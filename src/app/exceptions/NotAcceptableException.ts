import { HttpException } from './';

export class NotAcceptableException extends HttpException {
  constructor(obj: any = null) {
    super(406, obj);
  }
}
