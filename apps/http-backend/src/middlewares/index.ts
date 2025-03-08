import { JWT_SECRET } from "@repo/backend-common/index";
import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    res.status(401).json({
      message: "No token provided",
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(
    token as string,
    JWT_SECRET as Secret
  ) as jwt.JwtPayload;

  if (!decoded || !decoded.id) {
    res.status(403).json({
      message: "Invalid Token",
    });
    return;
  }

  req.body.id = decoded.id;
  next();
}
