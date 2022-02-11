import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { PoolInterface } from '../api/models/Pool';
import { GroupSchema } from './GroupModel';

// ------------------=[ SCHEMA DEFINITION ]=------------------ //
export const PoolSchema: Schema<PoolInterface> = new Schema<PoolInterface>(
  {
    _id: { type: String, required: true, default: uuidv4 },
    name: { type: String, required: true },
    email: String,
    avatar: String,
    branches: { type: [GroupSchema] },
  },
  { timestamps: true }
);

// ---------------------=[ MIDDLEWARES ]=--------------------- //

// --------------------=[ QUERY HELPERS ]=-------------------- //

// -------------------=[ MODEL DEFINITION ]=------------------ //
export const PoolModel = model<PoolInterface>('Pool', PoolSchema);
