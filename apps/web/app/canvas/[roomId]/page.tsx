"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import getChats from "../../../serverActions/getChats";
import leaveRoom from "./LeaveRoom";
import joinRoom from "./JoinRoom";
import InitDraw, { Shape, ShapeType } from "./InitDraw";
import clearCanvas from "./ClearCanvas";

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
    <div className="h-full overflow-hidden">
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
        <div
          className={`text-2xl cursor-pointer p-1 ${shapeType === "Line" ? "bg-blue-500" : ""}`}
          onClick={() => setShapeType("Line")}
        >
          Line
        </div>
      </div>
    </div>
  );
}
