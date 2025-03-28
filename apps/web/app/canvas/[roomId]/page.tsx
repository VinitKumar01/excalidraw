"use client";

import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import getChats from "../../../serverActions/getChats";

type Shape =
  | { type: "Rect"; x: number; y: number; width: number; height: number }
  | { type: "Circle"; centreX: number; centreY: number; radius: number };

type ShapeType = "Rect" | "Circle";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const params = useParams();
  const roomId = params.roomId as string;
  const [existingShapes, setExistingShapes] = useState<Shape[]>([]);
  const [wss, setWss] = useState<WebSocket>();
  const [hasJoined, setHasJoined] = useState(false);
  const [shapeType, setShapeType] = useState<ShapeType>("Rect");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      clearCanvas([...existingShapes], canvas, context);
    };

    setCanvasSize();

    window.addEventListener("resize", setCanvasSize);
    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, [existingShapes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    clearCanvas([...existingShapes], canvas, context);
  }, [existingShapes]);

  useEffect(() => {
    if (!wss || wss.readyState !== WebSocket.OPEN) return;

    wss.onmessage = (event) => {
      if (event.data === "Joined") return;

      try {
        const newShape = JSON.parse(event.data);
        setExistingShapes((prevShapes) => {
          const isDuplicate = prevShapes.some(
            (shape) => JSON.stringify(shape) === JSON.stringify(newShape)
          );
          return isDuplicate ? prevShapes : [...prevShapes, newShape];
        });
      } catch (error) {}
    };
  }, [wss]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!wss || !canvas || !context) return;

    const cleanup = InitDraw(
      canvas,
      roomId,
      context,
      () => existingShapes,
      setExistingShapes,
      wss,
      () => shapeType
    );

    return cleanup;
  }, [wss, existingShapes, shapeType]);

  useEffect(() => {
    const token = localStorage.getItem("token") as string;

    if (!hasJoined) {
      (async () => {
        await joinRoom(roomId, token, setWss, setHasJoined);
      })();
    }

    return () => {
      if (wss) {
        leaveRoom(roomId, wss, setWss);
        setHasJoined(false);
      }
    };
  }, [roomId, hasJoined]);

  useEffect(() => {
    const loadInitialShapes = async () => {
      try {
        const shapes = await getChats(roomId);
        setExistingShapes(shapes);
      } catch (error) {
        console.error("Failed to load initial shapes:", error);
      }
    };

    loadInitialShapes();

    return () => {
      if (wss) {
        leaveRoom(roomId, wss, setWss);
      }
    };
  }, [roomId]);

  return (
    <div>
      <canvas ref={canvasRef} />
      <div className="bg-slate-600 fixed top-5 right-44 left-44 shadow rounded-md flex justify-around">
        <div
          className={`text-2xl cursor-pointer p-1 ${shapeType === "Rect" ? "bg-blue-500" : ""}`}
          onClick={() => setShapeType("Rect")}
        >
          Rect
        </div>
        <div
          className={`text-2xl cursor-pointer p-1 ${shapeType === "Circle" ? "bg-blue-500" : ""}`}
          onClick={() => setShapeType("Circle")}
        >
          Circle
        </div>
      </div>
    </div>
  );
}

function InitDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  context: CanvasRenderingContext2D,
  getExistingShapes: () => Shape[],
  setExistingShapes: Dispatch<SetStateAction<Shape[]>>,
  wss: WebSocket,
  getShapeType: () => ShapeType
) {
  if (!canvas || !context) return () => {};

  let initialX = 0;
  let finalX = 0;
  let initialY = 0;
  let finalY = 0;
  let isClicked = false;
  let currentShapeType: ShapeType;

  const handleMouseDown = (e: MouseEvent) => {
    isClicked = true;
    initialX = e.clientX;
    initialY = e.clientY;
    currentShapeType = getShapeType(); // Capture the shape type at mousedown
  };

  const handleMouseUp = async (e: MouseEvent) => {
    if (!isClicked) return;

    isClicked = false;
    finalX = e.clientX;
    finalY = e.clientY;

    if (currentShapeType === "Rect") {
      const newShape: Shape = {
        type: "Rect",
        x: Math.min(initialX, finalX),
        y: Math.min(initialY, finalY),
        width: Math.abs(finalX - initialX),
        height: Math.abs(finalY - initialY),
      };
      if (newShape.width > 0 && newShape.height > 0) {
        setExistingShapes((prevShapes) => {
          const isDuplicate = prevShapes.some(
            (shape) => JSON.stringify(shape) === JSON.stringify(newShape)
          );
          return isDuplicate ? prevShapes : [...prevShapes, newShape];
        });

        await chat(roomId, JSON.stringify(newShape), wss);
      }
    } else if (currentShapeType === "Circle") {
      const newShape: Shape = {
        type: "Circle",
        centreX: initialX,
        centreY: initialY,
        radius: Math.abs(finalX - initialX),
      };
      if (newShape.radius > 0) {
        setExistingShapes((prevShapes) => {
          const isDuplicate = prevShapes.some(
            (shape) => JSON.stringify(shape) === JSON.stringify(newShape)
          );
          return isDuplicate ? prevShapes : [...prevShapes, newShape];
        });

        await chat(roomId, JSON.stringify(newShape), wss);
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isClicked) return;

    const currentShapes = getExistingShapes();

    clearCanvas(currentShapes, canvas, context);

    context.strokeStyle = "rgba(255, 255, 255, 0.7)";

    if (currentShapeType === "Rect") {
      const currentWidth = e.clientX - initialX;
      const currentHeight = e.clientY - initialY;
      context.strokeRect(
        Math.min(initialX, e.clientX),
        Math.min(initialY, e.clientY),
        Math.abs(currentWidth),
        Math.abs(currentHeight)
      );
    } else if (currentShapeType === "Circle") {
      const radius = Math.abs(e.clientX - initialX);
      context.beginPath();
      context.arc(initialX, initialY, radius, 0, 2 * Math.PI);
      context.stroke();
    }
  };

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);

  // Return a cleanup function to remove event listeners
  return () => {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mouseup", handleMouseUp);
    canvas.removeEventListener("mousemove", handleMouseMove);
  };
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.forEach((shape) => {
    if (shape.type === "Rect") {
      context.strokeStyle = "white";
      context.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "Circle") {
      context.strokeStyle = "white";
      context.beginPath();
      context.arc(shape.centreX, shape.centreY, shape.radius, 0, 2 * Math.PI);
      context.stroke();
    }
  });
}

async function joinRoom(
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

async function chat(roomId: string, message: string, wss: WebSocket) {
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

async function leaveRoom(
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
