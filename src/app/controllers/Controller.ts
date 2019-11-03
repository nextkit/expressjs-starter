import { Request, Router } from 'express';
import { validationResult } from 'express-validator';
import { BadRequestException } from '../exceptions';

/**
 * @class Controller
 *
 * Abstract class to extends for the other controllers.
 * Contains the routing logic for the API.
 */
export default abstract class Controller {
  protected router: Router;

  private pathPrefix: string;

  /**
   * Creates the controller and adds the endpoints to the router.
   *
   * @param pathPrefix of the endpoint
   */
  protected constructor(pathPrefix: string) {
    this.pathPrefix = pathPrefix;
    this.router = Router();

    this.addRoutes();
  }

  /**
   * Returns the router.
   */
  public getRouter(): Router {
    return this.router;
  }

  /**
   * Returns the path prefix of the controller.
   */
  public getPathPrefix(): string {
    return this.pathPrefix;
  }

  /**
   * Checks if the request has any errors.
   *
   * @param req
   */
  protected checkErrors(req: Request): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException({ errors: errors.array() });
    }
  }

  /**
   * Adds the endpoints to the router.
   */
  protected abstract addRoutes(): void;
}
