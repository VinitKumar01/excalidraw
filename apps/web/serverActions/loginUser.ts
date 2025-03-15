"use server";

import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "@repo/common-variables/config";

interface IUser {
  password: string;
  username: string;
}

export default async function loginUser(data: IUser) {
  const { username, password } = data;
  try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
      username,
      password,
    });

    if (response.status == 200) {
      return {
        success: true,
        message: "Signed in successfuly",
        token: response.data.token,
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
