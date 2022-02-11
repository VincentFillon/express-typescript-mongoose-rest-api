import { IsNotEmpty, IsUUID } from 'class-validator';
import { Service } from 'typedi';
import { GroupInterface } from '../../models/Group';

@Service()
export class BasePool {
  @IsNotEmpty({ message: 'You must enter the pool name.' })
  public name!: string;

  public email?: string;
  public avatar?: string;
}

@Service()
export class CreatePoolBody extends BasePool {
  public branches?: GroupInterface[];
}

@Service()
export class UpdatePoolBody extends CreatePoolBody {
  @IsUUID()
  public _id!: string;
}

@Service()
export class UpdatePoolBranchesBody extends UpdatePoolBody {
  @IsNotEmpty({ message: 'You must add at least one group.' })
  public branches!: GroupInterface[];
}
