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
import { addNewGroup } from "./group";
import bcrypt from "bcrypt";

import db from "../config/db";

const SALT_ROUNDS = 10;

export const login = async (
  email: IUser["email"],
  password: IUser["password"]
) => {
  const user: User = await getUserByEmail(email);
  if (!user) throw new Error("Invalid email or password");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid email or password");

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
    groupId: user.group_id,
    userLevel: user.user_level,
    companyId: user.company_id,
    groupName: user.group_name,
    firstLogin: user.first_login,
    firstName: user.first_name,
    lastName: user.last_name,
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
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const company = await addNewCompany(newUser.company_name, client);
    if (!company) throw new Error("company not created");

    const group = await addNewGroup(
      newUser.group_name || "managers",
      company.company_id,
      client
    );
    if (!group) throw new Error("group not created");

    const passwordHash = await bcrypt.hash(newUser.password, SALT_ROUNDS);

    const userToInsert = {
      ...newUser,
      group_id: group.group_id,
      password: passwordHash,
    } as User;

    const user = await addNewUser(userToInsert, client);
    if (!user) throw new Error("user not created");

    await client.query("COMMIT");

    const accessToken = generateAccessToken(user.user_id);
    const refreshToken = generateRefreshToken(user.user_id);
    await updateRefreshToken(user, refreshToken);

    return {
      accessToken,
      refreshToken,
      id: user.user_id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      userLevel: user.user_level,
      groupId: user.group_id,
      groupName: group.group_name,
      firstName: user.first_name,
      lastName: user.last_name,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};