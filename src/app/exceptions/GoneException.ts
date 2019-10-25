import { HttpException } from './';

export class GoneException extends HttpException {
  constructor(obj: any = null) {
    super(410, obj);
  }
}
