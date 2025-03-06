import * as z from "zod";

export const userSchema = z.object({
    email: z
        .string({ required_error: "Email must be provided" })
        .email({ message: "Invalid Email Format" }),
    username: z
        .string({ required_error: "Username must be provided" })
        .min(3, { message: "Username must be 3 letters or more" })
        .max(20, { message: "Username must be less than 20 characters" })
        .regex(/^[a-zA-Z0-9_]+$/, {
            message: "Username can only contain letters, numbers, and underscores",
        }),
    password: z
        .string({ required_error: "Password must be provided" })
        .min(8, { message: "Password must be 8 letters or characters" })
        .regex(/^(?=.*[a-zA-Z])(?=.*[\d\W])[a-zA-Z\d\W]{8,}$/, {
            message:
                "Password must include 8+ chars, at least 1 letter, 1 special char or number",
        }),
});