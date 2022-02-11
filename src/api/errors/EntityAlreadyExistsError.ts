import { HttpError } from 'routing-controllers';
import { isNil } from '../utils/utils';

export class EntityAlreadyExistsError extends HttpError {
  public static readonly ENTITY_POOL = 'Pool';
  public static readonly ENTITY_GROUP = 'Group';
  public static readonly ENTITY_USER = 'User';

  constructor(entity: 'Pool' | 'Group' | 'User', keyValue?: { [key: string]: string }) {
    super(404, `${entity} already exists.`);
    this.name = `${entity}AlreadyExistsError`;

    if (!isNil(keyValue)) {
      let message = `${entity} with `;
      let first = true;
      for (const key of Object.keys(keyValue)) {
        message += !first ? ' and ' : '';
        message += `${key} [${keyValue[key]}] `;
        first = false;
      }
      message += 'already exists.';
      this.message = message;
    }
  }
}
