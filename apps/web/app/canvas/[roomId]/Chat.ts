export default async function chat(
  roomId: string,
  message: string,
  wss: WebSocket
) {
  if (!wss) {
    return;
  }

  if (wss.readyState !== WebSocket.OPEN) {
    return;
  }

  wss.send(
    JSON.stringify({
      type: "chat",
      roomId,
      message,
    })
  );
}
