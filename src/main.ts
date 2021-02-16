import App from './app/app';
import * as bodyParser from 'body-parser';
import { CONTROLLERS } from './controllers';
import corsMiddleware from './middlewares/cors.middleware';
import loggerMiddleware from './middlewares/logger.middleware';

const app = new App({
  controllers: CONTROLLERS,
  middleWares: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    corsMiddleware,
    loggerMiddleware,
  ],
});

app.listen();
