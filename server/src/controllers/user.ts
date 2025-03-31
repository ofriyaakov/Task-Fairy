import userModel, { IUser } from "../models/user";

export const getAllUsers = () => userModel.find();

export const getUserById = (id) => {
  const user = userModel.findById(id);
  if (!user) throw new Error("User not found");
  return user;
};

export const getUserByEmail = (email: IUser["email"]) => {
  const user = userModel.findOne({ email });
  if (!user) throw new Error("User not found");
  return user;
};

export const addNewUser = (user: IUser) => userModel.create(user);

export const updateUserById = (
  id,
  {
    name,
    gender,
    height,
    weight,
    fitLevel,
    image,
  }: Omit<IUser, "password" | "email" | "tokens">
) =>
  userModel.findByIdAndUpdate(
    id,
    { name, gender, fitLevel, weight, height, image },
    { new: true }
  );

export const updateUserTokenById = (id, newRefreshToken) =>
  userModel.findByIdAndUpdate(id, { tokens: newRefreshToken }, { new: true });
