import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import mongoose from 'mongoose';
import { env } from '../env';

export const mongoDBLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
  if (settings) {
    const mongodb_connection_str = `mongodb://${env.db.username}:${env.db.password}@${env.db.host}:${env.db.port}/${env.db.database}?authSource=admin`;

    await mongoose.connect(mongodb_connection_str);

    const connection = mongoose.connection;

    // Here we can set the data for other loaders
    settings.setData('connection', connection);

    settings.onShutdown(() => connection.close());
  }
};
