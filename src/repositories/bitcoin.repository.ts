import moment from 'moment';
import { IUpdateBitcoin } from '../app/common/interfaces/IUpdateBitcoin.model';
import { BitcoinDto } from '../app/common/schemas/Bitcoin.dto';

// Mock a DB layer
class BitcoinRepository {
  private static instance: BitcoinRepository;
  private bitcoin: BitcoinDto = new BitcoinDto();

  private constructor() {}

  // I create instance for getting the same object in all services
  // If we will have the internal service for getting bitcoin info
  // It wont be necessary
  public static getInstance(): BitcoinRepository {
    if (!BitcoinRepository.instance) {
      BitcoinRepository.instance = new BitcoinRepository();
    }

    return BitcoinRepository.instance;
  }

  // I think if bitcoin object wont be stored on our db
  // We can use there getter and setter
  // And move this file to common folder
  async updateBitcoin(data: IUpdateBitcoin): Promise<BitcoinDto> {
    this.bitcoin = Object.assign(this.bitcoin, data, {
      updatedAt: moment().format(),
    });

    return this.bitcoin;
  }

  // See comment above
  async getBitcoin(): Promise<BitcoinDto> {
    return this.bitcoin;
  }
}

export default BitcoinRepository;
