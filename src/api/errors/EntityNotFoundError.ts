import { HttpError } from 'routing-controllers';

export class EntityNotFoundError extends HttpError {
  public static readonly ENTITY_POOL = 'Pool';
  public static readonly ENTITY_GROUP = 'Group';
  public static readonly ENTITY_USER = 'User';

  constructor(entity: 'Pool' | 'Group' | 'User') {
    super(404, `${entity} not found!`);
    this.name = `${entity}NotFoundError`;
  }
}
