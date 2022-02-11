import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let connection: MongoMemoryServer;

export const createDatabaseConnection = async () => {
  connection = await MongoMemoryServer.create();
  const uri = connection.getUri();
  await mongoose.connect(uri);
};

export const clearDatabase = async () => {
  if (connection != null) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
};

export const closeDatabase = async () => {
  if (connection != null) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await connection.stop();
  }
};
