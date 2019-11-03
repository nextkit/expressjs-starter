import { HttpException } from './';

export class ServiceUnavailableException extends HttpException {
  constructor(obj: any = null) {
    super(503, obj);
  }
}
