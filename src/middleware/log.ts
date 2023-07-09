import { Request, Response, NextFunction } from "express";

const logRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log("Request running on Path:", req.originalUrl);
  console.log("Request type:", req.method);
  next();
};

const urlValidator = (req: Request, res: Response) => {
  res.status(404).json({
    message: "404",
  });
};

module.exports = { logRequest, urlValidator };
