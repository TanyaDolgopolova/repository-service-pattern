import express, { Application } from 'express';
import { config } from '../config/config';
import errorMiddleware from '../middlewares/error.middleware';

class App {
  private readonly app: Application;

  constructor(appInit: { middleWares: any; controllers: any }) {
    this.app = express();

    this.middlewares(appInit.middleWares);
    this.routes(appInit.controllers);
    this.initializeErrorHandling();
  }

  public listen(): void {
    this.app.listen(config.port, () => {
      console.log(`App listening on the http://${config.host}:${config.port}`);
    });
  }

  private routes(controllers: {
    forEach: (arg0: (controller: any) => void) => void;
  }): void {
    controllers.forEach((controller) => this.app.use('/', controller.router));
  }

  private middlewares(middleWares: {
    forEach: (arg0: (middleWare: any) => void) => void;
  }): void {
    middleWares.forEach((middleWare) => this.app.use(middleWare));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
