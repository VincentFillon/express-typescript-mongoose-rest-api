import 'reflect-metadata';
import { bootstrapMicroframework } from 'microframework-w3tec';
import { banner } from './lib/banner';
import { Logger } from './lib/logger';
import { eventDispatchLoader } from './loaders/eventDispatchLoader';
import { expressLoader } from './loaders/expressLoader';
import { homeLoader } from './loaders/homeLoader';
import { iocLoader } from './loaders/iocLoader';
import { mongoDBLoader } from './loaders/mongoDBLoader';
import { monitorLoader } from './loaders/monitorLoader';
import { publicLoader } from './loaders/publicLoader';
import { swaggerLoader } from './loaders/swaggerLoader';
import { winstonLoader } from './loaders/winstonLoader';

const log = new Logger(__filename);

bootstrapMicroframework({
  loaders: [winstonLoader, iocLoader, eventDispatchLoader, mongoDBLoader, expressLoader, swaggerLoader, monitorLoader, homeLoader, publicLoader],
})
  .then(() => banner(log))
  .catch((error) => log.error('Application is crashed: ' + error));
