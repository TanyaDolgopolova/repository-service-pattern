import { NextFunction, Request, Response } from 'express';
import HttpException from '../app/common/HttpException';
import { IUpdateBitcoin } from '../app/common/interfaces/IUpdateBitcoin.model';
import BitcoinRepository from '../repositories/bitcoin.repository';

class BitcoinService {
  private readonly bitcoinRepository: BitcoinRepository;

  constructor() {
    this.bitcoinRepository = BitcoinRepository.getInstance();
  }

  public async updateCurrency(req: Request, res: Response, next: NextFunction) {
    const body = req.body as IUpdateBitcoin;

    if (!body || Object.getOwnPropertyNames(body).length === 0) {
      return next(new HttpException(404, 'No data provided.'));
    }

    if (!body.price) {
      return next(new HttpException(412, 'Precondition Failed.'));
    }

    const currency = await this.bitcoinRepository.updateBitcoin(body);
    if (!currency) {
      return next(new HttpException(400, 'Cannot update currency.'));
    }

    return res.status(200).send(currency);
  }

  public async getCurrent(req: Request, res: Response, next: NextFunction) {
    const currency = await this.bitcoinRepository.getBitcoin();
    if (!currency) {
      return next(new HttpException());
    }

    return res.status(200).send(currency);
  }
}

export default BitcoinService;
