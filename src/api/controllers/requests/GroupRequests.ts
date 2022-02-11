import { IsNotEmpty, IsUUID } from 'class-validator';
import { Service } from 'typedi';
import { UserInterface } from '../../models/User';

@Service()
export class BaseGroup {
  @IsNotEmpty({ message: 'You must enter the group name.' })
  public name!: string;

  public email?: string;
  public avatar?: string;
}

@Service()
export class CreateGroupBody extends BaseGroup {
  public members?: UserInterface[];
}

@Service()
export class UpdateGroupBody extends CreateGroupBody {
  @IsUUID()
  public _id!: string;
}

@Service()
export class UpdateGroupMembersBody extends UpdateGroupBody {
  @IsNotEmpty({ message: 'You must add at least one user.' })
  public members!: UserInterface[];
}
