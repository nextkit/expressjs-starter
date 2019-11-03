import { Router } from 'express';

/**
 * @class Controller
 *
 * Abstract class to extends for the other controllers.
 * Contains the routing logic for the API.
 */
export abstract class Controller {
  private pathPrefix: string;
  private router: Router;

  /**
   * Creates the controller and adds the endpoints to the router.
   *
   * @param pathPrefix of the endpoint
   */
  constructor(pathPrefix: string) {
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
   * Adds the endpoints to the router.
   */
  protected abstract addRoutes(): void;
}
