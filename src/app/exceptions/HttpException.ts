export class HttpException extends Error {
  protected status: number;
  protected object: any;

  constructor(status: number, object: any = null) {
    super('HttpException');

    this.status = status;
    this.object = object;
    this.name = HttpException.name;
  }
}
