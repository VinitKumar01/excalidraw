import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { JWT_SECRET, WS_PORT } from "@repo/common-variables/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: Number(WS_PORT) });

interface Users {
  userId: string;
  ws: WebSocket;
  rooms: number[];
}

const users: Users[] = [];

function authenticateUser(token: string): string | undefined {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as Secret) as JwtPayload;

    if (!decoded || !decoded.id) {
      return;
    }

    return decoded.id;
  } catch (_) {
    return;
  }
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    ws.close(1008, "No URL provided");
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || " ";

  const userId = authenticateUser(token);
  if (!userId) {
    ws.close(1008, "Authentication failed");
    return;
  }

  users.push({
    userId,
    ws,
    rooms: [],
  });

  ws.on("message", async function message(data) {
    const parsedData = JSON.parse(data as unknown as string);

    if (parsedData.type === "join_room") {
      const user = users.find((user) => user.ws === ws);

      if (user) {
        const alreadyJoined = user?.rooms.includes(parsedData.roomId);

        if (!alreadyJoined) {
          user.rooms.push(Number(parsedData.roomId));
          ws.send("Joined");
        } else {
          ws.send("Already joined");
        }
      }
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((user) => user.ws === ws);
      if (!user) {
        ws.close(1008, "Invalid user id");
        return;
      }

      user.rooms = user.rooms.filter((room) => room !== parsedData.roomId);
    }

    if (parsedData.type === "chat") {
      console.log("chatting");
      const roomId = Number(parsedData.roomId);
      const message = parsedData.message;

      const user = users.find((user) => user.ws === ws);
      const joined = user?.rooms.includes(roomId);
      console.log(joined);

      if (joined) {
        //queue the backend call using redis or kafka to reduce latency
        await prismaClient.chat.create({
          data: {
            message,
            roomId,
            userId,
          },
        });

        users.forEach((user) => {
          console.log(user.userId);
          if (user.rooms.includes(roomId) && user.ws !== ws) {
            user.ws.send(message);
          }
        });
      }
    }
  });
});
