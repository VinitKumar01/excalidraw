"use server";

import { WS_SERVER_URL } from "@repo/common-variables/config";
import { existingShapes } from "../draw";

export default async function parseChat() {
  const ws = new WebSocket(`${WS_SERVER_URL}`);
  ws.onmessage = (event) => {
    console.log(event.data);
    existingShapes.push(JSON.parse(event.data));
  };
}
