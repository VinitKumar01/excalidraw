import express, { Router, Request, Response } from "express";
import { userSchema } from "@repo/common/types"
import * as bcrypt from "bcrypt";
import { prismaClient } from "@repo/db/client"


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
                {email: { contains: email}},
                {username: { contains: username}}
            ]
        }
    })

    if (userExists) {
        res.status(403).json({
            message: "User with same email or password already exists"
        });
        return;
    }

    try {
        await prismaClient.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        res.json({
            message: "User signed up"
        })
    } catch (_) {
        res.status(500).json({
            message: "Error occured while signing"
        })
    }
})

UserRouter.post("/signin", (req: Request, res: Response) => {
    res.json({
        message: "Signin Route"
    })
})