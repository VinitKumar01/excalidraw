"use server";

import { WS_SERVER_URL } from "@repo/common-variables/config";

export default async function joinRoom(roomId: string) {
  const ws = new WebSocket(`${WS_SERVER_URL}`);
  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        type: "join_room",
        roomId,
      })
    );
  };
}
