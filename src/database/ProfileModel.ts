import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ProfileInterface } from '../api/models/Profile';
import { PoolSchema } from './PoolModel';

// ------------------=[ SCHEMA DEFINITION ]=------------------ //
export const ProfileSchema: Schema<ProfileInterface> = new Schema<ProfileInterface>(
  {
    _id: { type: String, required: true, default: uuidv4 },
    name: { type: String, required: true },
    admin: { type: Boolean, default: false },
    director: { type: Boolean, default: false },
    manager: { type: Boolean, default: false },
    permissions: { type: Map, of: Boolean },
    pool: { type: PoolSchema },
  },
  { timestamps: true }
);

// ---------------------=[ MIDDLEWARES ]=--------------------- //

// --------------------=[ QUERY HELPERS ]=-------------------- //

// -------------------=[ MODEL DEFINITION ]=------------------ //
export const ProfileModel = model<ProfileInterface>('Profile', ProfileSchema);
