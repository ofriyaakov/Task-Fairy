import jwt from "jsonwebtoken";
import { getUserById, updateUserTokenById } from "../controllers/user";
import { tUser } from "../models/user";
import { UnauthorizedError } from "../errors/UnauthorizedError ";

export const updateRefreshToken = async (user, refreshToken: string) => {
  if (refreshToken) user.tokens.push(refreshToken);
  const updatedTokens = !!refreshToken ? user.tokens : [];
  return await updateUserTokenById(user.id, updatedTokens);
};

export const generateAccessToken = (userId) =>
  jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const verifyAccessToken = (token: string) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
      if (error) {
        reject(error);
      } else {
        resolve(user);
      }
    });
  });

export const generateRefreshToken = (userId) =>
  jwt.sign({ _id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

export const verifyRefreshToken = (refreshToken: string) => {
  return new Promise<tUser>((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err: any, payload: any) => {
        if (err) {
          throw new Error(err);
        }

        const userId = payload._id;

        try {
          const user = await getUserById(userId);

          if (!user.tokens || !user.tokens.includes(refreshToken)) {
            updateRefreshToken(user, null);
            reject(new UnauthorizedError("Invalid access token"));
          }

          resolve(user);
        } catch (err) {
          reject(new UnauthorizedError("Invalid access token"));
        }
      }
    );
  });
};
