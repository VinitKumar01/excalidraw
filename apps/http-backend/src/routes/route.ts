import express, { Router, Request, Response } from "express";
import { userSchema } from "@repo/common/types"
import * as bcrypt from "bcrypt";

//const userSchema = types.userSchema;

export const UserRouter: express.Router = Router();

UserRouter.post("/signup", async (req: Request, res: Response) => {
    // const { error } = userSchema.safeParse(req.body);

    // if (error) {
    //     res.status(411).json({
    //         error: error.format(),
    //     });
    //     return;
    // }

    // const { username, email, password } = req.body;
    // const hashedPassword = await bcrypt.hash(password, 10);
    res.json({
        message: "Signup Route"
    })
})

UserRouter.post("/signin", (req: Request, res: Response) => {
    res.json({
        message: "Signin Route"
    })
})