"use client";

import { BACKEND_URL } from "@repo/common-variables/config";
import axios, { AxiosError } from "axios";
export default async function createRoom(slug: string, token: string) {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/room`,
      {
        slug,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status == 200) {
      return {
        success: true,
        message: "Room created successfuly",
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
        (axiosError.response
          ? axiosError.response.data.message
          : "Server Down"),
    };
  }
}
