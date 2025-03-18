"use client";
import Form from "next/form";
import { Button } from "./Button";
import { Input } from "./Input";
import { useState } from "react";
import { userSchema } from "@repo/common/types";
import createUser from "../serverActions/createUser";
import { useRouter } from "next/navigation";
import loginUser from "../serverActions/loginUser";
import ToastMessage from "./ToastMessage";

interface IAuthComponent {
  isSignin: boolean;
}

interface IFormError {
  formErrors: string[];
  fieldErrors: { username?: string[]; email?: string[]; password?: string[] };
}

export default function AuthComponent({ isSignin }: IAuthComponent) {
  const router = useRouter();
  const [formError, setFormError] = useState<IFormError | null>();
  const [serverError, setServerError] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  async function handleSignup(formData: FormData) {
    const userData = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const SignUpSchema = userSchema.omit({ slug: true });

    const { error, success, data } = SignUpSchema.safeParse(userData);

    if (error || !success) {
      setFormError(error.formErrors);
      return;
    }
    setFormError(null);

    const response = await createUser(data);

    setServerError(!response.success);
    setServerMessage(response.message);

    if (response.success) {
      router.push("/signin");
    }
  }

  async function handleSignin(formData: FormData) {
    const userData = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    const SignUpSchema = userSchema.omit({ slug: true, email: true });

    const { error, success, data } = SignUpSchema.safeParse(userData);

    if (error || !success) {
      setFormError(error.formErrors);
      return;
    }
    setFormError(null);

    const response = await loginUser(data);

    setServerError(!response.success);
    setServerMessage(response.message);

    if (response.success) {
      localStorage.setItem("token", response.token);
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-slate-100">
      <div className="flex flex-col justify-center items-center h-fit w-fit rounded-md shadow bg-white">
        <div className="font-bold text-4xl p-8">
          {isSignin ? "Sign In" : "Sign Up"}
        </div>
        <Form
          action={isSignin ? handleSignin : handleSignup}
          className="flex flex-col justify-center items-center m-4"
        >
          {!isSignin && (
            <Input
              type="email"
              placeholder="Email"
              autoComplete="email"
              name="email"
            />
          )}
          {!isSignin && formError?.fieldErrors?.email && (
            <div className="text-red-600">{formError?.fieldErrors.email}</div>
          )}
          <Input
            type="text"
            placeholder="Username"
            autoComplete="username"
            name="username"
          />
          {formError?.fieldErrors?.username && (
            <div className="text-red-600 text-wrap">
              {formError?.fieldErrors.username}
            </div>
          )}
          <Input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            name="password"
          />
          <Button value={isSignin ? "SignIn" : "SignUp"} />
        </Form>
      </div>
      {serverMessage && (
        <ToastMessage success={!serverError} message={serverMessage} />
      )}
    </div>
  );
}
