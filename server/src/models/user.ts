import mongoose, { Document, Types } from "mongoose";
const Schema = mongoose.Schema;

export enum UserLevel {
  Employee = 1,
  Manager = 2,
  Admin = 3,
}

export type User = {
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  password: string;
  user_level: UserLevel;
  tokens?: string[];
  phone_number?: string;
  group_id?: number;
  group_name?: string;
  company_name?: string;
  company_id?: number;
  gender?: string;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  password: string;
  tokens: string[];
}

export type tUser = Document<unknown, {}, IUser> &
  IUser &
  Required<{
    _id: Types.ObjectId;
  }> & {
    __v: number;
  };

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: {
    type: [String],
  },
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
