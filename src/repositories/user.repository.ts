import moment from 'moment';
import { IEditUser } from '../app/common/interfaces/IEditUser.model';
import { ISignUp } from '../app/common/interfaces/ISignUp.model';
import { IUserDto } from '../app/common/schemas/IUser.dto';

// Mock a DB layer
class UserRepository {
  private users: IUserDto[] = [];

  public async signUpUser(data: ISignUp): Promise<IUserDto | null> {
    const user = Object.assign({}, data, {
      id: this.users.length + 1,
      bitcoinAmount: 0,
      usdBalance: 0,
      createdAt: moment().format(),
      updatedAt: null,
    });
    this.users.push(user);
    return user;
  }

  public async getUserById(id: number): Promise<IUserDto | null> {
    return this.users.find((user) => user.id == id);
  }

  public async editUserById(
    id: number,
    data: IEditUser
  ): Promise<IUserDto | null> {
    const userIndex = this.users.findIndex((user) => user.id == id);
    if (userIndex === -1) {
      return null;
    }

    this.users[userIndex] = Object.assign(
      this.users[userIndex],
      {
        name: data.name ? data.name : this.users[userIndex].name,
        email: data.email ? data.email : this.users[userIndex].email,
      },
      {
        updatedAt: moment().format(),
      }
    );

    return this.users[userIndex];
  }

  public async updateUsdAmount(
    id: number,
    data: {
      usdBalance: number;
      bitcoinAmount: number;
    }
  ): Promise<IUserDto | null> {
    const userIndex = this.users.findIndex((user) => user.id == id);
    if (userIndex === -1) {
      return null;
    }

    this.users[userIndex] = Object.assign(this.users[userIndex], data, {
      updatedAt: moment().format(),
    });

    return this.users[userIndex];
  }
}

export default UserRepository;
