"use client";
import { useEffect, useRef } from "react";
import InitDraw, { clearCanvas, existingShapes } from "../../../draw";
import joinRoom from "../../../serverActions/joinRoom";
import { useParams } from "next/navigation";
import leaveRoom from "../../../serverActions/leaveRoom";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initDrawCalledRef = useRef(false);
  const params = useParams();
  const roomId = params.roomId as string;

  useEffect(() => {
    (async () => {
      await joinRoom(roomId);
    })();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      clearCanvas(existingShapes, canvas, context);
    };

    setCanvasSize();

    if (!initDrawCalledRef.current) {
      InitDraw(canvas, roomId);
      initDrawCalledRef.current = true;
    }

    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      leaveRoom(roomId);
    };
  }, []);

  return <canvas ref={canvasRef} />;
}
