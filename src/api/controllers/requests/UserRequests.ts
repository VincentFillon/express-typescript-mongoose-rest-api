import { IsEmail, IsNotEmpty, IsUUID, Matches, MinLength } from 'class-validator';
import { Service } from 'typedi';
import { ProfileInterface } from '../../models/Profile';

@Service()
export class BaseUser {
  public firstName?: string;

  @IsNotEmpty({ message: 'You must enter your last name.' })
  public lastName!: string;

  @IsNotEmpty({ message: 'You must enter an email address.' })
  @IsEmail({ message: 'Your email address is not valid. Valid format example : user@example.com.' })
  public email!: string;

  public username?: string;

  public profile?: ProfileInterface;
}

@Service()
export class CreateUserBody extends BaseUser {
  @IsNotEmpty({ message: 'You must enter a password.' })
  @MinLength(8, { message: 'Password must contain at least 8 characters.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@#$!%*?&^<>~_-]{8,}$/, {
    message:
      'Password must contain at least one lowercase character, one uppercase character and one number.' +
      '\nAllowed special characters are : @ # $ ! % * ? & ^ < > ~ _ -',
  })
  public password!: string;
}

@Service()
export class UpdateUserBody {
  @IsUUID()
  public _id!: string;
  public firstName?: string;
  public lastName?: string;
  public username?: string;
  public profile?: ProfileInterface;
}

@Service()
export class UpdateUserEmailBody extends UpdateUserBody {
  @IsNotEmpty({ message: 'You must enter an email address.' })
  @IsEmail({ message: 'Your email address is not valid. Valid format example : user@example.com.' })
  public email!: string;
}

@Service()
export class UpdateUserPasswordBody extends UpdateUserBody {
  @IsNotEmpty({ message: 'You must enter a password.' })
  @MinLength(8, { message: 'Password must contain at least 8 characters.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@#$!%*?&^<>~_-]{8,}$/, {
    message:
      'Password must contain at least one lowercase character, one uppercase character and one number.' +
      '\nAllowed special characters are : @ # $ ! % * ? & ^ < > ~ _ -',
  })
  public password!: string;
}
