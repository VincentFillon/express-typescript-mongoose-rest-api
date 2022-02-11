import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { IsDefined, IsNotEmpty } from 'class-validator';
import { Service } from 'typedi';
import { IMain, Main } from './Main';
import { Profile, ProfileInterface } from './Profile';

export interface UserInterface extends IMain {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  profile?: ProfileInterface;
}

@Service()
export class User extends Main implements UserInterface {
  public firstName?: string;

  @IsNotEmpty()
  public lastName!: string;

  @IsNotEmpty()
  public email!: string;

  @IsNotEmpty()
  public username!: string;

  @Exclude({ toPlainOnly: true })
  public password?: string;

  @IsDefined()
  public profile!: Profile;

  constructor(user?: UserInterface) {
    super(user);
  }

  public toString(): string {
    let id = '';
    if (this._id) {
      id = `[${this._id}] `;
    }
    let fullName = '';
    if (this.firstName) {
      fullName = `${this.firstName} `;
    }
    fullName += this.lastName;
    return `${id}${fullName} (${this.username} - ${this.email})`;
  }

  /**
   * Compare input password to user hashed password
   * @param password input password
   */
  public comparePassword(password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.password === undefined) {
        return resolve(false);
      } else {
        bcrypt.compare(password, this.password, (err, res) => {
          resolve(res === true);
        });
      }
    });
  }
}
