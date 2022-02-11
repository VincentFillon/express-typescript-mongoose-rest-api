import { IsDefined, IsNotEmpty } from 'class-validator';
import { Service } from 'typedi';
import { Pool } from './Pool';
import { Permissions } from './enums/Permissions';
import { IMain, Main } from './Main';

export interface ProfileInterface extends IMain {
  /** Profile name */
  name?: string;
  /** Is admin ? (full access across all companies) */
  admin?: boolean;
  /** Is director ? (full access across his pool) */
  director?: boolean;
  /** Is director ? (full access across his group) */
  manager?: boolean;
  /** Profile permissions */
  permissions?: Map<Permissions, boolean>;
  /** Pool to which the profile is attached */
  pool?: Pool;
}

/** Profile default configuration */
const defaultProfile: ProfileInterface = {
  admin: false,
  director: false,
  manager: false,
  permissions: new Map<Permissions, boolean>([
    [Permissions.POOL_UPDATE, false],
    [Permissions.POOL_GROUPS_GET, false],
    [Permissions.POOL_GROUPS_UPDATE, false],
    [Permissions.POOL_GROUPS_DELETE, false],
    [Permissions.GROUP_USERS_GET, true],
    [Permissions.GROUP_USERS_UPDATE, false],
    [Permissions.GROUP_USERS_DELETE, false],
  ]),
};

@Service()
export class Profile extends Main implements ProfileInterface {
  @IsNotEmpty()
  public name!: string;

  @IsDefined()
  public admin!: boolean;

  @IsDefined()
  public director!: boolean;

  @IsDefined()
  public manager!: boolean;

  @IsDefined()
  public permissions!: Map<Permissions, boolean>;

  constructor(profile?: ProfileInterface) {
    super(defaultProfile);
    this.hydrate(profile);
  }

  public toString(): string {
    let id = '';
    if (this._id) {
      id = `[${this._id}] `;
    }
    let types = '';
    if (this.admin || this.director || this.manager) {
      const typesList = [];
      if (this.admin) {
        typesList.push('admin');
      }
      if (this.director) {
        typesList.push('director');
      }
      if (this.manager) {
        typesList.push('manager');
      }
      types = ` (${typesList.join(' | ')})`;
    }
    return `${id}${this.name}${types}`;
  }
}
