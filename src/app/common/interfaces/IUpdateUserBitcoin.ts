import BitcoinActionEnum from '../enums/BitcoinAction.enum';

export interface IUpdateUserBitcoins {
  action: BitcoinActionEnum;
  amount: number;
}
