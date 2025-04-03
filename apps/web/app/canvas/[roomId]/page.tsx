"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import getChats from "../../../serverActions/getChats";
import leaveRoom from "./LeaveRoom";
import joinRoom from "./JoinRoom";
import InitDraw, { Shape, ShapeType } from "./InitDraw";
import clearCanvas from "./ClearCanvas";
import { Button } from "../../../components/Button";
import {
  CircleIcon,
  LineIcon,
  PenIcon,
  RectangleIcon,
  TextIcon,
} from "../../icons";

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
      <div className="bg-slate-400 fixed top-5 left-5 bottom-5 md:top-5 md:right-44 md:left-44 md:bottom-auto shadow rounded-md flex md:flex-row flex-col justify-between">
        <div
          className={`items-center flex flex-col justify-center rounded-md m-1 cursor-pointer p-1 ${shapeType === "Rect" ? "bg-purple-500" : ""}`}
          onClick={() => setShapeType("Rect")}
        >
          <RectangleIcon />
        </div>
        <div
          className={`items-center flex flex-col justify-center rounded-md m-1 cursor-pointer p-1 ${shapeType === "Circle" ? "bg-purple-500" : ""}`}
          onClick={() => setShapeType("Circle")}
        >
          <CircleIcon />
        </div>
        <div
          className={`items-center flex flex-col justify-center rounded-md m-1 cursor-pointer p-1 ${shapeType === "Line" ? "bg-purple-500" : ""}`}
          onClick={() => setShapeType("Line")}
        >
          <LineIcon />
        </div>
        <div
          className={`items-center flex flex-col justify-center rounded-md m-1 cursor-pointer p-1 ${shapeType === "Pencil" ? "bg-purple-500" : ""}`}
          onClick={() => setShapeType("Pencil")}
        >
          <PenIcon />
        </div>
        <div
          className={`items-center flex flex-col justify-center rounded-md m-1 cursor-pointer p-1 ${shapeType === "Text" ? "bg-purple-500" : ""}`}
          onClick={() => setShapeType("Text")}
        >
          <TextIcon />
        </div>
      </div>
      <div className="fixed bottom-5 right-10">
        <Button
          onClick={() => {
            const canvas = canvasRef.current;
            const img = canvas
              ?.toDataURL("image/png")
              .replace("image/png", "image/octet-stream");
            window.location.href = img as string;
          }}
          value="Save PNG"
        />
      </div>
    </div>
  );
}
