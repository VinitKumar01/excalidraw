"use server";

import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "@repo/common-variables/config";

interface IUser {
  email: string;
  password: string;
  username: string;
}

export default async function createUser(data: IUser) {
  const { username, email, password } = data;
  try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
      username,
      email,
      password,
    });

    if (response.status == 200) {
      return {
        success: true,
        message: "Signed up successfuly",
      };
    } else {
      return {
        success: false,
        message: response.data.message,
      };
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return {
      success: false,
      message:
        "⚠️ Request failed: " +
        (axiosError.response && axiosError.response.data.message),
    };
  }
}
