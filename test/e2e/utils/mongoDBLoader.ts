import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';

import { closeDatabase, createDatabaseConnection } from '../../utils/database';

export const mongoDBLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
  await createDatabaseConnection();
  if (settings) {
    settings.onShutdown(() => closeDatabase());
  }
};
