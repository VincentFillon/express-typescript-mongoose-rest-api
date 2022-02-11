import { User } from '../../../src/api/models/User';
import { UserService } from '../../../src/api/services/UserService';
import { events } from '../../../src/api/subscribers/events';
import { closeDatabase, createDatabaseConnection } from '../../utils/database';
import { EventDispatcherMock } from '../lib/EventDispatcherMock';
import { LogMock } from '../lib/LogMock';

describe('UserService', () => {
  const johnDoe = new User({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com',
    username: 'jDoe',
    password: '0n&Two3f0uR',
  });

  beforeAll(async () => {
    await createDatabaseConnection();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test('Create should dispatch subscribers', async () => {
    const log = new LogMock();
    const ed = new EventDispatcherMock();
    const userService = new UserService(ed as any, log);
    const newUser = await userService.create(johnDoe);
    expect(ed.dispatchMock).toBeCalledWith([events.user.created, newUser]);
  });

  test('Find should return a list of users', async () => {
    const log = new LogMock();
    const ed = new EventDispatcherMock();
    const userService = new UserService(ed as any, log);
    const list = await userService.find();
    expect(list[0].email).toBe(johnDoe.email);
  });
});
