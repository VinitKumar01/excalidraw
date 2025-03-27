"use server";

import { BACKEND_URL } from "@repo/common-variables/config";
import axios from "axios";

export default async function getChats(roomId: string) {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/user/chats/${roomId}`
    );
    return response.data.messages;
  } catch (error) {
    console.log(error);
  }
}
