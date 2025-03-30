import { Dispatch, SetStateAction } from "react";

export default async function joinRoom(
  roomId: string,
  token: string,
  setWss: Dispatch<SetStateAction<WebSocket | undefined>>,
  setHasJoined: Dispatch<SetStateAction<boolean>>
) {
  return new Promise<void>((resolve, reject) => {
    const ws = new WebSocket(`ws://localhost:8080/?token=${token}`);

    ws.onopen = () => {
      setWss(ws);
      setHasJoined(true);

      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );
      resolve();
    };

    ws.onerror = (error) => {
      setHasJoined(false);
      reject(error);
    };

    ws.onclose = () => {
      setWss(undefined);
      setHasJoined(false);
    };
  });
}
