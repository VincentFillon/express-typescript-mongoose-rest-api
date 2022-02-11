import * as bcrypt from 'bcrypt';
import { CallbackError, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { HashingError } from '../errors/HashingError';
import { UserInterface } from '../models/User';
import { ProfileSchema } from './ProfileModel';

// ------------------=[ SCHEMA DEFINITION ]=------------------ //
export const UserSchema: Schema<UserInterface> = new Schema<UserInterface>(
  {
    _id: { type: String, required: true, default: uuidv4 },
    firstName: String,
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profile: { type: ProfileSchema },
  },
  { timestamps: true }
);

// ---------------------=[ MIDDLEWARES ]=--------------------- //
UserSchema.pre('save', async function (next: (err?: CallbackError | undefined) => void): Promise<any> {
  const currentPassword = this.password;
  try {
    this.password = await new Promise<string>((resolve, reject) => {
      bcrypt.hash(currentPassword, 10, (err, hash) => {
        if (err) {
          return reject(err);
        }
        resolve(hash);
      });
    });
  } catch (err) {
    if (err instanceof Error) {
      return next(err);
    } else {
      return next(new HashingError());
    }
  }
  return next();
});

// --------------------=[ QUERY HELPERS ]=-------------------- //
/* interface UserQueryHelpers {
  byLastname(lastName: string): Query<any, Document<UserInterface>> & UserQueryHelpers;
  byEmail(email: string): Query<any, Document<UserInterface>> & UserQueryHelpers;
  byUserName(username: string): Query<any, Document<UserInterface>> & UserQueryHelpers;
}

UserSchema.query.byLastname = function (lastName: string): Query<any, Document<UserInterface>> & UserQueryHelpers {
  return this.where({ lastName: new RegExp(lastName, 'i') });
};

UserSchema.query.byEmail = function (email: string): Query<any, Document<UserInterface>> & UserQueryHelpers {
  return this.where({ email: new RegExp(email, 'i') });
};

UserSchema.query.byUserName = function (username: string): Query<any, Document<UserInterface>> & UserQueryHelpers {
  return this.where({ username: new RegExp(username, 'i') });
}; */

// -------------------=[ MODEL DEFINITION ]=------------------ //
export const UserModel = model<UserInterface>('User', UserSchema);
