import express, { Router, Request, Response } from "express";
import { userSchema } from "@repo/common/types";
import * as bcrypt from "bcrypt";
import { prismaClient } from "@repo/db/client";
import jwt, { Secret } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { authenticateUser } from "../middlewares";

export const UserRouter: express.Router = Router();

const signupSchema = userSchema.omit({ slug: true });

UserRouter.post("/signup", async (req: Request, res: Response) => {
  const { data, error, success } = signupSchema.safeParse(req.body);

  if (error || !success) {
    res.status(411).json({
      error: error.format(),
    });
    return;
  }

  const { username, email, password } = data;
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

const signinSchema = userSchema.omit({ email: true, slug: true });

UserRouter.post("/signin", async (req: Request, res: Response) => {
  const { data, error, success } = signinSchema.safeParse(req.body);

  if (error || !success) {
    res.status(411).json({
      error: error.format(),
    });
    return;
  }

  const { username, password } = data;

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

const roomSchema = userSchema.omit({
  username: true,
  email: true,
  password: true,
});

UserRouter.post(
  "/room",
  authenticateUser,
  async (req: Request, res: Response) => {
    const { data, error, success } = roomSchema.safeParse(req.body);

    if (error || !success) {
      res.status(411).json({
        error: error.format(),
      });
      return;
    }

    const { slug } = data;

    try {
      const room = await prismaClient.room.create({
        data: {
          slug,
          admin: req.body.id,
        },
      });

      res.json({
        roomId: room.id,
      });
    } catch (_) {
      res.status(411).json({
        message: "Room already exists with this name",
      });
    }
  }
);
