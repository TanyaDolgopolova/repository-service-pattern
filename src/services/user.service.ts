import { NextFunction, Request, Response } from 'express';
import validator from 'validator';
import UsdActionEnum from '../app/common/enums/UsdAction.enum';
import HttpException from '../app/common/HttpException';
import { IEditUser } from '../app/common/interfaces/IEditUser.model';
import { ISignUp } from '../app/common/interfaces/ISignUp.model';
import { IUpdateUsdAmount } from '../app/common/interfaces/IUpdateUsdAmount.model';
import BitcoinRepository from '../repositories/bitcoin.repository';
import UserRepository from '../repositories/user.repository';

class UserService {
  private readonly userRepository: UserRepository;
  private readonly bitcoinRepository: BitcoinRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.bitcoinRepository = BitcoinRepository.getInstance();
  }

  public async signUp(req: Request, res: Response, next: NextFunction) {
    const body = req.body as ISignUp;

    if (!body || Object.getOwnPropertyNames(body).length === 0) {
      return next(new HttpException(404, 'No data provided.'));
    }

    if (!body.name || !body.userName || !validator.isEmail(body.email)) {
      return next(new HttpException(412, 'Precondition Failed.'));
    }

    const user = await this.userRepository.signUpUser(body);
    if (!user) {
      return next(new HttpException());
    }

    return res.status(200).send(user);
  }

  public async getUserById(req: Request, res: Response, next: NextFunction) {
    if (!req.params.id) {
      return next(new HttpException(404, 'No data provided.'));
    }

    const user = await this.userRepository.getUserById(Number(req.params.id));
    if (!user) {
      return next(new HttpException(400, 'User not found.'));
    }

    return res.status(200).send(user);
  }

  public async editUserById(req: Request, res: Response, next: NextFunction) {
    const body = req.body as IEditUser;

    if (
      !body ||
      !req.params.id ||
      Object.getOwnPropertyNames(body).length === 0
    ) {
      return next(new HttpException(404, 'No data provided.'));
    }

    if (body.email && !validator.isEmail(body.email)) {
      return next(new HttpException(412, 'Precondition Failed.'));
    }

    const user = await this.userRepository.editUserById(
      Number(req.params.id),
      body
    );
    if (!user) {
      return next(new HttpException(400, 'Cannot update user.'));
    }

    return res.status(200).send(user);
  }

  public async getUserBalance(req: Request, res: Response, next: NextFunction) {
    if (!req.params.userId) {
      return next(new HttpException(404, 'No data provided.'));
    }

    const user = await this.userRepository.getUserById(
      Number(req.params.userId)
    );
    const bitcoin = await this.bitcoinRepository.getBitcoin();

    const balance = user.usdBalance + user.bitcoinAmount * bitcoin.price;

    return res.status(200).send({
      balance,
    });
  }

  public async updateUsdAmount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const body = req.body as IUpdateUsdAmount;

    if (
      !body ||
      Object.getOwnPropertyNames(body).length === 0 ||
      !req.params.userId
    ) {
      return next(new HttpException(404, 'No data provided.'));
    }

    const user = await this.userRepository.getUserById(
      Number(req.params.userId)
    );
    let amount = user.usdBalance;

    switch (body.action) {
      case UsdActionEnum.DEPOSIT: {
        if (validator.isNumeric(body.amount + '')) {
          amount = body.amount + user.usdBalance;
        }

        break;
      }
      case UsdActionEnum.WITHDRAW: {
        if (validator.isNumeric(body.amount + '')) {
          if (user.usdBalance >= body.amount) {
            amount = user.usdBalance - body.amount;
          } else {
            return next(new HttpException(400, 'Insufficient funds.'));
          }
        }

        break;
      }
      default: {
        return next(new HttpException(404, 'No data provided.'));
      }
    }

    const updatedUser = await this.userRepository.updateUsdAmount(
      user.id,
      amount
    );

    return res.status(200).send(updatedUser);
  }
}

export default UserService;
