import mongoose, { Document, Types } from "mongoose";
const Schema = mongoose.Schema;

export interface IUser {
  email: string;
  name: string;
  password: string;
  image?: string;
  gender?: string;
  fitLevel?: string;
  weight?: number;
  height?: number;
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
  fitLevel: {
    type: String,
  },
  gender: {
    type: String,
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  image: {
    type: String,
  },
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
