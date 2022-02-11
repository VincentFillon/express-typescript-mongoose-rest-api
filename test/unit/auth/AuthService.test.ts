import { Request } from 'express';
import { UserService } from '../../../src/api/services/UserService';

import { AuthService } from '../../../src/auth/AuthService';
import { env } from '../../../src/env';
import { closeDatabase, createDatabaseConnection } from '../../utils/database';
import { EventDispatcherMock } from '../lib/EventDispatcherMock';
import { LogMock } from '../lib/LogMock';

const MockExpressRequest = require('mock-express-request');

describe('AuthService', () => {
  let authService: AuthService;
  let log: LogMock;

  beforeEach(async () => {
    await createDatabaseConnection();
    log = new LogMock();
    const ed = new EventDispatcherMock();
    const userService = new UserService(ed as any, log);
    authService = new AuthService(log, userService);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  describe('parseTokenFromRequest', () => {
    test('Should return the credentials of the basic authorization header', () => {
      const base64 = Buffer.from(`${env.superadmin.login}:${env.superadmin.password}`).toString('base64');
      const req: Request = new MockExpressRequest({
        headers: {
          Authorization: `Basic ${base64}`,
        },
      });
      const credentials = authService.parseBasicAuthFromRequest(req);
      expect(credentials).toBeDefined();
      expect(credentials?.username).toBe(env.superadmin.login);
      expect(credentials?.password).toBe(env.superadmin.password);
    });

    test('Should return undefined if there is no basic authorization header', () => {
      const req: Request = new MockExpressRequest({
        headers: {},
      });
      const token = authService.parseBasicAuthFromRequest(req);
      expect(token).toBeUndefined();
      expect(log.infoMock).toBeCalledWith('No credentials provided by the client', []);
    });

    test('Should return undefined if there is a invalid basic authorization header', () => {
      const req: Request = new MockExpressRequest({
        headers: {
          Authorization: 'Basic 1234',
        },
      });
      const token = authService.parseBasicAuthFromRequest(req);
      expect(token).toBeUndefined();
      expect(log.infoMock).toBeCalledWith('No credentials provided by the client', []);
    });
  });
});
