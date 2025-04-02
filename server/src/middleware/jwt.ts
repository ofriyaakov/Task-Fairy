import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/UnauthorizedError ";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError("Missing access token");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      next(new UnauthorizedError("Invalid access token"));
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;
