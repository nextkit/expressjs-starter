import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import expressPino from 'express-pino-logger';
import helmet from 'helmet';
import { Server } from 'http';
import mongoose from 'mongoose';

import { Controller } from './controllers';
import { BadRequestException } from './exceptions';
import { ErrorMiddleware } from './middleware';
import logger from './util/logger';

/**
 * @class App
 */
export class App {
  private app: Application = express();
  private httpServer: Server = new Server(this.app);

  /**
   * Initializes the express app and the http server with the passed controllers.
   *
   * @param {Controller[]} controllers
   */
  constructor(controllers: Controller[]) {
    this.initExpress();
    this.initDatabase().then();
    this.initMiddleware();
    this.initControllers(controllers);
    // this.initErrorMiddleware();
  }

  /**
   * Start the server.
   */
  public start(): Promise<void> {
    return new Promise((resolve) => {
      const port = process.env.PORT || 8080;

      // Start server.
      this.httpServer.listen(port, () => {
        logger.info(`Server running on port ${port}`);
        resolve();
      });
    });
  }

  /**
   * Connect to the mongoDB.
   */
  private initDatabase(): Promise<void> {
    return new Promise((resolve) => {
      const connection = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

      mongoose.Promise = global.Promise;
      mongoose
        .connect(connection, {
          useFindAndModify: false,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(() => {
          logger.info(
            `Connected to mongodb on ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
          );
          resolve();
        })
        .catch((err: string) => {
          logger.error(`Failed to connect to MongoDB: \n\r${err}`);
          logger.error('Try running "npm run mongo" to start a local server instance.');
          process.exit(1);
        });
    });
  }

  /**
   * Setup the Application.
   */
  private initExpress(): void {
    // Setup parser and helmet.
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(helmet());

    // Setup logging.
    const expressLogger = expressPino({ logger });
    this.app.use(expressLogger);

    // Setup cors.
    const whitelisted = JSON.parse(process.env.WHITELIST || '["*"]');
    const corsOptions: cors.CorsOptions = {
      origin: (
        requestOrigin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void,
      ): void => {
        if (whitelisted.indexOf(requestOrigin) !== -1 || whitelisted.indexOf('*') !== -1) {
          callback(null, true);
        } else {
          callback(new BadRequestException({ error: 'Not allowed by CORS' }));
        }
      },
    };
    this.app.use(cors(corsOptions));

    // Setup headers.
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials',
      );
      res.header('Access-Control-Expose-Headers', 'Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');
      next();
    });
  }

  /**
   * Adds the middleware for all controllers.
   */
  private initMiddleware(): void {
    this.app.use(ErrorMiddleware.handle);
  }

  /**
   * Adds the controllers to the App.
   *
   * @param {Controller[]} controllers
   */
  private initControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.app.use(`/api${controller.getPathPrefix()}`, controller.getRouter());
    });

    // Setup error middleware.
    this.app.use(ErrorMiddleware.handle);
  }
}
