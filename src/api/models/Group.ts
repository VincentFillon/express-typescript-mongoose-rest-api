import { IsDefined, IsNotEmpty } from 'class-validator';
import { Service } from 'typedi';
import { IMain, Main } from './Main';
import { User, UserInterface } from './User';

export interface GroupInterface extends IMain {
  name?: string;
  email?: string;
  avatar?: string;
  members?: UserInterface[];
}

@Service()
export class Group extends Main implements GroupInterface {
  @IsNotEmpty()
  public name!: string;

  public email?: string;

  public avatar?: string;

  @IsDefined()
  public members!: User[];

  constructor(user?: GroupInterface) {
    super(user);
  }

  public toString(): string {
    let id = '';
    if (this._id) {
      id = `[${this._id}] `;
    }
    let email = '';
    if (this.email) {
      email = ` (${this.email})`;
    }
    let members = '';
    if (this.members) {
      members = ` - ${this.members.length} member${this.members.length > 1 ? 's' : ''}`;
    }
    return `${id}${this.name}${email}${members}`;
  }
}
