import { Dispatch, SetStateAction } from "react";

export default async function leaveRoom(
  roomId: string,
  wss: WebSocket,
  setWss: Dispatch<SetStateAction<WebSocket | undefined>>
) {
  if (wss && wss.readyState === WebSocket.OPEN) {
    wss.send(
      JSON.stringify({
        type: "leave_room",
        roomId,
      })
    );
    wss.close();
    setWss(undefined);
  } else {
  }
}
