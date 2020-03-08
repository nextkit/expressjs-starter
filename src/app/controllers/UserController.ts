import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import authJwt from 'express-jwt';
import { body } from 'express-validator';

import { IJwtRequest, JwtAction } from '../actions';
import { BadRequestException, ConflictException } from '../exceptions';
import { User } from '../models';
import Controller from './Controller';

/**
 * @class UserController
 */
export default class UserController extends Controller {
  private readonly PASSWORD_LENGTH: number = 6;

  constructor() {
    super('/users');
  }

  protected addRoutes(): void {
    // Routes
    this.router.post(
      '/register',
      [
        body('username')
          .exists()
          .trim()
          .isLength({ min: 3 }),
        body('email')
          .exists()
          .isEmail()
          .normalizeEmail(),
        body('password')
          .exists()
          .trim()
          .isLength({ min: this.PASSWORD_LENGTH }),
      ],
      this.register,
    );
    this.router.post(
      '/login',
      [
        body('email')
          .exists()
          .isEmail()
          .normalizeEmail(),
        body('password')
          .exists()
          .isLength({ min: this.PASSWORD_LENGTH })
          .trim(),
      ],
      this.login,
    );

    // Protected routes.
    this.router.use(authJwt(JwtAction.getConfig()));

    this.router.delete(
      '/',
      [
        body('password')
          .exists()
          .isLength({ min: this.PASSWORD_LENGTH })
          .trim(),
      ],
      this.delete,
    );
    this.router.patch(
      '/',
      [
        body('newPassword')
          .exists()
          .isLength({ min: this.PASSWORD_LENGTH })
          .trim(),
        body('password')
          .exists()
          .isLength({ min: this.PASSWORD_LENGTH })
          .trim(),
      ],
      this.update,
    );
  }

  /**
   * Registers the user. Creates a new data set in the db. The Response contains a JsonWebToken for the user.
   *
   * @param req
   * @param res
   * @param next
   */
  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      super.checkErrors(req);

      const { username, email, password } = req.body;

      const user = new User({
        email,
        password,
        username,
      });

      // Check if E-Mail or username is already used.
      if (!(await user.emailValid())) {
        throw new ConflictException({ errors: [{ param: 'email' }] });
      }
      if (!(await user.usernameValid())) {
        throw new ConflictException({ errors: [{ param: 'username' }] });
      }

      await user.save();

      // Get token.
      const token = await JwtAction.token({ _id: user._id, username: user.username }, `${user._id}`);

      res.status(201).send({ token });
    } catch (e) {
      next(e);
    }
  }

  /**
   * Logs the user in.
   *
   * @param req
   * @param res
   * @param next
   */
  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      super.checkErrors(req);

      const { email, password } = req.body;

      const user = await User.findOne({ email }, '_id username password');

      if (!user) {
        throw new BadRequestException();
      }
      const result: boolean = await bcrypt.compare(password, user.password);

      if (!result) {
        return next(new BadRequestException());
      }

      // Get token.
      const token = await JwtAction.token({ _id: user._id, username: user.username }, `${user._id}`);

      res.status(200).send({ token });
    } catch (e) {
      next(e);
    }
  }

  /**
   * Updates the password of the user.
   *
   * @param req
   * @param res
   * @param next
   */
  public async update(req: IJwtRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      super.checkErrors(req);

      const { password, newPassword } = req.body;

      const user = await User.findById(req.user._id, 'password');

      const result: boolean = await bcrypt.compare(password, user.password);

      if (!result) {
        return next(new BadRequestException());
      }

      // Update the password.
      const hash: string = await bcrypt.hash(newPassword, Number(process.env.SALT_ROUND) || 12);

      await User.findByIdAndUpdate(req.user._id, { password: hash });
      res.send({});
    } catch (e) {
      next(e);
    }
  }

  /**
   * Deletes the user.
   *
   * @param req
   * @param res
   * @param next
   */
  public async delete(req: IJwtRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      super.checkErrors(req);

      const { password } = req.body;

      const user = await User.findById(req.user._id);

      const result = await bcrypt.compare(password, user.password);

      if (!result) {
        return next(new BadRequestException());
      }
      await user.remove();

      res.send();
    } catch (e) {
      next(e);
    }
  }
}
