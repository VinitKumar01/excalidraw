"use client";
import { useEffect, useRef } from "react";
import InitDraw, { clearCanvas, existingShapes } from "../../../draw";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initDrawCalledRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      clearCanvas(existingShapes, canvas, context)
    };

    setCanvasSize();

    if (!initDrawCalledRef.current) {
      InitDraw(canvas);
      initDrawCalledRef.current = true;
    }

    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef}/>;
}
