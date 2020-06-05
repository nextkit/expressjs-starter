import dotenv from 'dotenv';
dotenv.config();

import { expect } from 'chai';
import { agent as request } from 'supertest';
import _app from '../../src/index';

const app = _app.getExpressApp();
