import { Application } from 'express';
import * as http from 'http';
import { Microframework, bootstrapMicroframework } from 'microframework-w3tec';
import mongoose from 'mongoose';

import { eventDispatchLoader } from '../../../src/loaders/eventDispatchLoader';
import { expressLoader } from '../../../src/loaders/expressLoader';
import { homeLoader } from '../../../src/loaders/homeLoader';
import { iocLoader } from '../../../src/loaders/iocLoader';
import { winstonLoader } from '../../../src/loaders/winstonLoader';
import { mongoDBLoader } from './mongoDBLoader';

export interface BootstrapSettings {
  framework: Microframework,
  app: Application;
  server: http.Server;
  connection: mongoose.Connection;
}

export const bootstrapApp = async (): Promise<BootstrapSettings> => {
  const framework = await bootstrapMicroframework({
    loaders: [winstonLoader, iocLoader, eventDispatchLoader, mongoDBLoader, expressLoader, homeLoader],
  });
  return {
    framework,
    app: framework.settings.getData('express_app') as Application,
    server: framework.settings.getData('express_server') as http.Server,
    connection: framework.settings.getData('connection') as mongoose.Connection,
  } as BootstrapSettings;
};
