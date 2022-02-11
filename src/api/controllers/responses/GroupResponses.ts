import { IsUUID } from 'class-validator';
import { Service } from 'typedi';
import { User } from '../../models/User';
import { BaseGroup } from '../requests/GroupRequests';

@Service()
export class GroupResponse extends BaseGroup {
  @IsUUID()
  public id!: string;
  public members!: User[];
}
