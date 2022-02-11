import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { GroupInterface } from '../models/Group';
import { UserSchema } from './UserModel';

// ------------------=[ SCHEMA DEFINITION ]=------------------ //
export const GroupSchema: Schema<GroupInterface> = new Schema<GroupInterface>(
  {
    _id: { type: String, required: true, default: uuidv4 },
    name: { type: String, required: true },
    email: String,
    avatar: String,
    members: { type: [UserSchema] },
  },
  { timestamps: true }
);

// ---------------------=[ MIDDLEWARES ]=--------------------- //

// --------------------=[ QUERY HELPERS ]=-------------------- //

// -------------------=[ MODEL DEFINITION ]=------------------ //
export const GroupModel = model<GroupInterface>('Group', GroupSchema);
