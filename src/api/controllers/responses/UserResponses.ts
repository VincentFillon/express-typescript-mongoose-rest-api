import { IsUUID } from 'class-validator';
import { Service } from 'typedi';
import { BaseUser } from '../requests/UserRequests';

@Service()
export class UserResponse extends BaseUser {
  @IsUUID()
  public id!: string;
}
