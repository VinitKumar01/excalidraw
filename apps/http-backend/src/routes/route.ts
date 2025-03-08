import express, { Router, Request, Response } from "express";
import { userSchema } from "@repo/common/types";
import * as bcrypt from "bcrypt";
import { prismaClient } from "@repo/db/client";
import jwt, { Secret } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { authenticateUser } from "../middlewares";

export const UserRouter: express.Router = Router();

UserRouter.post("/signup", async (req: Request, res: Response) => {
  const { error } = userSchema.safeParse(req.body);

  if (error) {
    res.status(411).json({
      error: error.format(),
    });
    return;
  }

  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const userExists = await prismaClient.user.findFirst({
    where: {
      OR: [
        { email: { contains: email } },
        { username: { contains: username } },
      ],
    },
  });

  if (userExists) {
    res.status(403).json({
      message: "User with same email or password already exists",
    });
    return;
  }

  try {
    await prismaClient.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.json({
      message: "User signed up",
    });
  } catch (_) {
    res.status(500).json({
      message: "Error occured while signing",
    });
  }
});

const signinSchema = userSchema.omit({ email: true });

UserRouter.post("/signin", async (req: Request, res: Response) => {
  const { error } = signinSchema.safeParse(req.body);

  if (error) {
    res.status(411).json({
      error: error.format(),
    });
    return;
  }

  const { username, password } = req.body;

  try {
    const userExists = await prismaClient.user.findFirst({
      where: {
        username: { contains: username },
      },
    });

    if (!userExists) {
      res.status(403).json({
        message: "User doesn't exists",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, userExists.password);

    if (!isMatch) {
      res.status(403).json({
        message: "Incorrect credentials",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: userExists.id,
      },
      JWT_SECRET as Secret
    );

    res.json({
      token,
    });
  } catch (_) {
    res.status(500).json({
      message: "Error occured while signing in",
    });
  }
});
