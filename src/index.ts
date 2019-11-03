import dotenv from 'dotenv';
dotenv.config();

import { UserController } from './app/controllers';
import { Server } from './app/Server';

const app = new Server([
  new UserController(),
]);

app.start();
