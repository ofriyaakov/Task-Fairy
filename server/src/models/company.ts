import mongoose, { Document, Types } from "mongoose";
const Schema = mongoose.Schema;

export type Company = {
  company_id: BigInteger;
  company_name: string;
}

export interface ICompany {
    company_id: BigInteger;
    company_name: string;
}

export type tCompany = Document<unknown, {}, ICompany> &
ICompany &
  Required<{
    _id: Types.ObjectId;
  }> & {
    __v: number;
  };

const companySchema = new Schema<ICompany>({
  company_id: {
    type: BigInt,
    required: true,
    primary: true,
    autoIncrement: true,
  },
  company_name: {
    type: String,
    required: true,
  }
});

const companyModel = mongoose.model("Company", companySchema);
export default companyModel;
