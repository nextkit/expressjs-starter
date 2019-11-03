import { NextFunction, Request, Response } from 'express';

import { HttpException } from '../exceptions';
import logger from '../util/logger';

/**
 * @class ErrorMiddleware
 *
 * Handles error thrown while processing a request
 */
export abstract class ErrorMiddleware {
  /**
   * Handles the errors.
   *
   * @param err
   * @param req
   * @param res
   * @param next
   */
  public static handle(
    err: HttpException | any,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    // Default is an 500 error.
    let status = 500;
    let obj = null;

    // This is for Token error handling.
    // if (err.name === 'UnauthorizedError') {
    //   return res.status(401).send({ error: 'Invalid Token' });
    // }

    // Check HTTP error.
    if (err instanceof HttpException === true) {
      status = err.status;
      obj = err.object;
    } else if (err != null) {
      // Or normal error.
      logger.fatal(err.toString() + ' - ' + err.stack);
    }

    if (obj == null) {
      res.status(status).send();
    } else {
      res.status(status).send(obj);
    }
  }
}
