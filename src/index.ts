import dotenv from 'dotenv';
dotenv.config();

import { App } from './app/App';

const app = new App([]);
app.start();
