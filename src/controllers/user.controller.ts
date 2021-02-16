import * as express from 'express';
import { NextFunction, Request, Response, Router } from 'express';
import IControllerBase from '../app/common/IControllerBase';
import { config } from '../config/config';
import UserService from '../services/user.service';

class UserController implements IControllerBase {
  private readonly router: Router;
  private readonly userService: UserService;

  constructor() {
    this.router = express.Router();
    this.userService = new UserService();
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.post(
      `${config.baseRoute}/users`,
      (req: Request, res: Response, next: NextFunction) =>
        this.userService.signUp(req, res, next)
    );

    this.router.get(
      `${config.baseRoute}/users/:id`,
      (req: Request, res: Response, next: NextFunction) =>
        this.userService.getUserById(req, res, next)
    );

    this.router.put(
      `${config.baseRoute}/users/:id`,
      (req: Request, res: Response, next: NextFunction) =>
        this.userService.editUserById(req, res, next)
    );

    this.router.get(
      `${config.baseRoute}/users/:userId/balance`,
      (req: Request, res: Response, next: NextFunction) =>
        this.userService.getUserBalance(req, res, next)
    );

    this.router.post(
      `${config.baseRoute}/users/:userId/usd`,
      (req: Request, res: Response, next: NextFunction) =>
        this.userService.updateUsdAmount(req, res, next)
    );

    this.router.post(
      `${config.baseRoute}/users/:userId/bitcoins`,
      (req: Request, res: Response, next: NextFunction) =>
        this.userService.manageUserBitcoins(req, res, next)
    );
  }
}

export default UserController;
