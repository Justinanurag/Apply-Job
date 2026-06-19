import jwt from "jsonwebtoken";
import { findUserById } from "../models/user.model.js";
import { env } from "../config/env.js";

export const getUserFromRequest = async (req) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.accessTokenSecret);
    return await findUserById(decoded.sub);
  } catch {
    return null;
  }
};
