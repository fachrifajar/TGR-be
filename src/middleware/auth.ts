require("dotenv").config();
import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
const ACC_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  if (
    !req?.headers?.authorization?.replace("Bearer ", "") &&
    req?.query?.token &&
    req?.cookies?.token
  ) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  const token =
    req?.headers?.authorization?.replace("Bearer ", "") ||
    req?.query?.token ||
    req?.cookies?.token;

  try {
    jwt.verify(token, ACC_TOKEN_SECRET, (err: any, decoded: any) => {
      if (err) return res.status(401).json({ message: "Token Expired" });
      (req as any).id = decoded.id;
      (req as any).name = decoded.name;

      next();
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  req.user ? next() : res.sendStatus(401);
};

module.exports = { validateToken, isLoggedIn };
