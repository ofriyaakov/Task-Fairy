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
import db from "../config/db";

export const login = async (
  email: IUser["email"],
  password: IUser["password"]
) => {
  const user: User = await getUserByEmail(email);
  if (!user) throw new Error("Invalid email or password");
  if (password != user.password) throw new Error("Invalid email or password");

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
    group_id: user.group_id,
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
  // 1) grab a dedicated client
  const client = await db.connect();

  try {
    // 2) start transaction
    await client.query("BEGIN");

    // 3) all your helper calls, passing `client` as executor
    const company = await addNewCompany(newUser.company_name, client);
    if (!company) throw new Error("company not created");

    const group = await addNewGroup(newUser.group_name || "managers", company.company_id, client);
    if (!group) throw new Error("group not created");

    newUser.group_id = group.group_id;
    const user = await addNewUser(newUser, client);
    if (!user) throw new Error("user not created");

    // 4) commit if all succeeded
    await client.query("COMMIT");

    // 5) outside the transaction: issue tokens
    const accessToken  = generateAccessToken(user.user_id);
    const refreshToken = generateRefreshToken(user.user_id);
    await updateRefreshToken(user, refreshToken);

    return {
      accessToken,
      refreshToken,
      id:     user.user_id,
      name:   user.first_name + " " + user.last_name,
      email:  user.email,
    };
  } catch (err) {
    // on any error: rollback everything
    await client.query("ROLLBACK");
    throw err;
  } finally {
    // always release the client
    client.release();
  }
};