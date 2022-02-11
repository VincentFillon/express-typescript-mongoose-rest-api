import { IsUUID } from 'class-validator';
import { Service } from 'typedi';
import { Group } from '../../models/Group';
import { BasePool } from '../requests/PoolRequests';

@Service()
export class PoolResponse extends BasePool {
  @IsUUID()
  public id!: string;
  public branches?: Group[];
}
