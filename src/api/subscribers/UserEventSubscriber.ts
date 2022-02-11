import { EventSubscriber, On } from 'event-dispatch';
import { Service } from 'typedi';

import { Logger } from '../../lib/logger';
import { User } from '../models/User';
import { events } from './events';

const log = new Logger(__filename);

@EventSubscriber()
@Service()
export class UserEventSubscriber {
  @On(events.user.created)
  public onUserCreate(user: User): void {
    log.info('User ' + user.toString() + ' created!');
  }
  @On(events.user.updated)
  public onUserUpdate(user: User): void {
    log.info('User ' + user.toString() + ' updated!');
  }
  @On(events.user.deleted)
  public onUserDelete(user: User): void {
    log.info('User ' + user.toString() + ' deleted!');
  }
}
