import basicAuth from 'express-basic-auth';
import { Response, NextFunction } from 'express';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';

import { env } from '../env';

const monitorOptions = {
  spans: [
    {
      interval: 1,
      retention: 60,
    },
    {
      interval: 5,
      retention: 60,
    },
    {
      interval: 15,
      retention: 60,
    },
    {
      interval: 30,
      retention: 60,
    },
    {
      interval: 60,
      retention: 60,
    },
  ],
};

// tslint:disable-next-line: no-var-requires
const statusMonitor = require('express-status-monitor')(monitorOptions);

export const monitorLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  if (settings && env.monitor.enabled) {
    const expressApp = settings.getData('express_app');

    expressApp.use(statusMonitor);
    expressApp.get(env.monitor.route, (req: basicAuth.IBasicAuthedRequest, res: Response, next: NextFunction) => {
      res.setHeader('Content-Security-Policy', "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/ 'unsafe-inline'");
      return next();
    });
    expressApp.get(
      env.monitor.route,
      env.monitor.username
        ? basicAuth({
            users: {
              [`${env.monitor.username}`]: env.monitor.password,
            },
            challenge: true,
          })
        : (req: basicAuth.IBasicAuthedRequest, res: Response, next: NextFunction) => next(),
      statusMonitor.pageRoute
    );
  }
};

/* import * as express from 'express';
import basicAuth from 'express-basic-auth';
// import monitor from 'express-status-monitor';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';

import { env } from '../env';

// tslint:disable-next-line: no-var-requires
const statusMonitor = require('express-status-monitor')();

export const monitorLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  if (settings && env.monitor.enabled) {
    const expressApp = settings.getData('express_app');

    expressApp.use(statusMonitor.middleware);

    if (env.monitor.username) {
      expressApp.get(
        env.monitor.route,
        basicAuth({
          authorizer: (user: string, password: string) => user === env.monitor.username && password === env.monitor.password,
          challenge: true,
        }),
        (req: basicAuth.IBasicAuthedRequest, res: express.Response, next: express.NextFunction) => next(),
        statusMonitor.pageRoute
      );
    } else {
      expressApp.get(env.monitor.route, (req: express.Request, res: express.Response, next: express.NextFunction) => next(), statusMonitor.pageRoute);
    }
  }
};
 */
