import * as express from 'express';
import { Service } from 'typedi';

import { User } from '../api/models/User';
import { UserService } from '../api/services/UserService';
import { Logger, LoggerInterface } from '../decorators/Logger';

@Service()
export class AuthService {
  constructor(@Logger(__filename) private log: LoggerInterface, private userService: UserService) {}

  public parseBasicAuthFromRequest(req: express.Request): { username: string; password: string } | undefined {
    const authorization = req.header('authorization');

    if (authorization && authorization.split(' ')[0] === 'Basic') {
      this.log.info('Credentials provided by the client');
      const decodedBase64 = Buffer.from(authorization.split(' ')[1], 'base64').toString('ascii');
      const username = decodedBase64.split(':')[0];
      const password = decodedBase64.split(':')[1];
      if (username && password) {
        return { username, password };
      }
    }

    this.log.info('No credentials provided by the client');
    return undefined;
  }

  public async validateUser(username: string, password: string): Promise<User | undefined> {
    const user = await this.userService.findOneByUsername(username);

    if (user && user.password && user.comparePassword(password)) {
      return user;
    }

    return undefined;
  }
}
