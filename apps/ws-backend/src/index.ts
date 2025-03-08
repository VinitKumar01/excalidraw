import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });

interface Users {
  userId: string;
  ws: WebSocket;
  rooms: string[];
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

  ws.on("message", function message(data) {
    const parsedData = JSON.parse(data as unknown as string);

    if (parsedData.type === "join_room") {
      const user = users.find((user) => user.ws === ws);

      if (user) {
        const alreadyJoined = user?.rooms.includes(parsedData.roomId);

        if (!alreadyJoined) {
          user?.rooms.push(parsedData.roomId);
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
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      const user = users.find((user) => user.ws === ws);
      const joined = user?.rooms.includes(roomId);

      if (joined) {
        users.forEach((user) => {
          if (user.rooms.includes(roomId) && user.ws !== ws) {
            user.ws.send(
              JSON.stringify({
                type: "chat",
                message,
                roomId,
              })
            );
          }
        });
      }
    }
  });
});
