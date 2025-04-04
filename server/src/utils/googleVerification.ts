import { OAuth2Client } from "google-auth-library";
import { IUser, User } from "../models/user";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token: string) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error("GOOGLE_CLIENT_ID must be defined");
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid token payload");

    return {
      email: payload.email!,
      first_name: payload.name!,
      last_name: payload.family_name!,
    } as Pick<User, "email" | "first_name" | "last_name">;
  } catch (error) {
    throw new Error("Invalid Google token");
  }
};
