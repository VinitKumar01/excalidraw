"use server";

import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "@repo/common-variables/config";

export default async function searchRoom(slug: string) {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/v1/user/room/${slug}`);

    if (response.status == 200) {
      return {
        success: true,
        roomId: response.data.roomId,
      };
    } else {
      return {
        success: false,
        message: response.data.message,
      };
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.log(axiosError);
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
