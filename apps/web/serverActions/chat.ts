"use server";

import { WS_SERVER_URL } from "@repo/common-variables/config";

export default async function chat(roomId: string, message: string) {
  const ws = new WebSocket(`${WS_SERVER_URL}`);
  console.log("inside chats");

  ws.onopen = () => {
    console.log("Sending message");
    ws.send(
      JSON.stringify({
        type: "join_room",
        roomId,
      })
    );
    ws.send(
      JSON.stringify({
        type: "chat",
        roomId,
        message,
      })
    );
  };
}
