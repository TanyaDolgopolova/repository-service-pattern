import * as express from 'express';
import { NextFunction, Request, Response, Router } from 'express';
import IControllerBase from '../app/common/IControllerBase';
import { config } from '../config/config';
import BitcoinService from '../services/bitcoin.service';

class BitcoinController implements IControllerBase {
  private readonly router: Router;
  private readonly bitcoinService: BitcoinService;

  constructor() {
    this.router = express.Router();
    this.bitcoinService = new BitcoinService();
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get(
      `${config.baseRoute}/bitcoin`,
      (req: Request, res: Response, next: NextFunction) =>
        this.bitcoinService.getCurrent(req, res, next)
    );

    this.router.put(
      `${config.baseRoute}/bitcoin`,
      (req: Request, res: Response, next: NextFunction) =>
        this.bitcoinService.updateCurrency(req, res, next)
    );
  }
}

export default BitcoinController;
