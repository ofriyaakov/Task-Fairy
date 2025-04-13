import { BadRequestError } from "../errors/BadRequestError";
import { IUser, User, tUser } from "../models/user";
import { verifyGoogleToken } from "../utils/googleVerification";
import {
  generateAccessToken,
  generateRefreshToken,
  updateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import {
  updateUserTokenById,
  getUserById,
  getUserByEmail,
  addNewUser,
} from "./user";
import { addNewCompany } from "./company";

export const login = async (
  email: IUser["email"],
  password: IUser["password"]
) => {
  const user: User = await getUserByEmail(email);
  console.log("user", user);
  if (!user) throw new Error("User not found");
  if (password != user.password) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user.user_id);
  const refreshToken = generateRefreshToken(user.user_id);
  updateRefreshToken(user, refreshToken);

  return {
    accessToken,
    refreshToken,
    id: user.user_id,
    name: user.first_name + " " + user.last_name,
    email: user.email,
    tokens: user.tokens,
  };
};

// export const googleLogin = async (credential: string) => {
//   const googleUser = await verifyGoogleToken(credential);
//   let user: User = await getUserByEmail(googleUser.email);

//   if (!user) {
//     user = await addNewUser({
//       user_id: "123",
//       email: googleUser.email,
//       first_name: googleUser.first_name,
//       last_name: googleUser.last_name,
//       username: googleUser.first_name + googleUser.last_name,
//       password: "genericPass",
//       user
//       tokens: [],
//     });
//   }

//   const accessToken = generateAccessToken(user.user_id);
//   const refreshToken = generateRefreshToken(user.user_id);
//   await updateRefreshToken(user, refreshToken);

//   return {
//     accessToken,
//     refreshToken,
//     id: user.user_id,
//     name: user.first_name + " " + user.last_name,
//     email: user.email,
//     tokens: user.tokens,
//   };
// };

export const logout = async (refreshToken: string) => {
  const user = await verifyRefreshToken(refreshToken);
  if (!user) throw new Error("User not found");

  return updateUserTokenById(
    user.user_id,
    user.tokens.filter((token) => token !== refreshToken)
  );
};

export const refresh = async (refreshToken: string) => {
  const user = await verifyRefreshToken(refreshToken);
  if (!user) throw new Error("User not found");

  const accessToken = generateAccessToken(user.user_id);
  const newRefreshToken = generateRefreshToken(user.user_id);

  await updateRefreshToken(user, newRefreshToken);
  return { accessToken, refreshToken: newRefreshToken, user: user };
};

export const register = async (newUser: User) => {
  const company = await addNewCompany(newUser.company_name);
  if (!company) {
    throw new Error("company not created");
  } else {
    newUser.company_id = company.id;
    const user = await addNewUser(newUser);
    if (!user) throw new Error("user not created");

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    updateRefreshToken(user, refreshToken);

    return {
      accessToken,
      refreshToken,
      id: user.id,
      name: user.name,
      email: user.email,
      tokens: user.tokens,
    };
  }
};
