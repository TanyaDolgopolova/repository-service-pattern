
export interface IUserDto {
    id: string | number;
    name: string;
    userName: string;
    email: string;
    bitcoinAmount: number;
    usdBalance: number;
    createdAt: number;
    updatedAt: number | null;
}