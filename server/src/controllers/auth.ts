import { BadRequestError } from "../errors/BadRequestError";
import { IUser, tUser } from "../models/user";
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

export const login = async (
  email: IUser["email"],
  password: IUser["password"]
) => {
  // const user: tUser = await getUserByEmail(email);
  // if (!user) throw new Error("User not found");
  // if (password != user.password) throw new Error("Invalid credentials");

  const user  = {
    id: "12345",
    name: "John Doe",
    email: "john@gmail.com",
    tokens: []
  }
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
};

export const googleLogin = async (credential: string) => {
  const googleUser = await verifyGoogleToken(credential);
  let user = await getUserByEmail(googleUser.email);

  if (!user) {
    user = await addNewUser({
      email: googleUser.email,
      name: googleUser.name,
      password: "genericPass",
      tokens: [],
    });
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  await updateRefreshToken(user, refreshToken);

  return {
    accessToken,
    refreshToken,
    id: user.id,
    name: user.name,
    email: user.email,
    tokens: user.tokens,
  };
};

export const logout = async (refreshToken: string) => {
  if (!refreshToken) throw new BadRequestError("Missing Authorization header");

  const user = await verifyRefreshToken(refreshToken);
  if (!user) throw new Error("User not found");

  return updateUserTokenById(
    user.id,
    user.tokens.filter((token) => token !== refreshToken)
  );
};

export const refresh = async (refreshToken) => {
  if (!refreshToken) throw new BadRequestError("Missing Authorization header");

  const user = await verifyRefreshToken(refreshToken);
  if (!user) throw new Error("User not found");

  const accessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  await updateRefreshToken(user, newRefreshToken);
  return { accessToken, refreshToken: newRefreshToken, user: user };
};

export const register = async (newUser: IUser) => {
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
};
