export interface IUserDto {
  id: number;
  name: string;
  userName: string;
  email: string;
  bitcoinAmount: number;
  usdBalance: number;
  createdAt: string;
  updatedAt: string | null;
}
