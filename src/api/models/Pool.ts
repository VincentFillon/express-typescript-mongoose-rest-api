import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty } from 'class-validator';
import { Service } from 'typedi';
import { Group, GroupInterface } from './Group';
import { IMain, Main } from './Main';

export interface PoolInterface extends IMain {
  name?: string;
  email?: string;
  avatar?: string;
  branches?: GroupInterface[];
}

@Service()
export class Pool extends Main implements PoolInterface {
  @IsNotEmpty()
  public name!: string;

  public email?: string;

  public avatar?: string;

  @IsDefined()
  @Type(() => Group)
  public branches!: Group[];

  constructor(user?: PoolInterface) {
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
    let branches = '';
    if (this.branches) {
      branches = ` - ${this.branches.length} branche${this.branches.length > 1 ? 's' : ''}`;
    }
    return `${id}${this.name}${email}${branches}`;
  }
}
