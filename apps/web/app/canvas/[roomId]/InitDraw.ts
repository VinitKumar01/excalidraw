import { Dispatch, SetStateAction } from "react";
import clearCanvas from "./ClearCanvas";
import chat from "./Chat";

export type Shape =
  | { type: "Rect"; x: number; y: number; width: number; height: number }
  | { type: "Circle"; centreX: number; centreY: number; radius: number }
  | {
      type: "Line";
      initialX: number;
      initialY: number;
      finalX: number;
      finalY: number;
    }
  | { type: "Pencil"; points: { x: number; y: number }[] };

export type ShapeType = "Rect" | "Circle" | "Line" | "Pencil";

export default function InitDraw(
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

  let currentPoints: { x: number; y: number }[] = [];

  const handleMouseDown = (e: MouseEvent) => {
    isClicked = true;
    initialX = e.clientX;
    initialY = e.clientY;
    currentShapeType = getShapeType();
    if (currentShapeType === "Pencil") {
      currentPoints = [{ x: e.clientX, y: e.clientY }];
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
      const radius = Math.abs(e.clientX - initialX) / 2;
      const centerX = initialX + (e.clientX - initialX) / 2;
      const centerY = initialY + (e.clientY - initialY) / 2;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      context.stroke();
    } else if (currentShapeType === "Line") {
      context.beginPath();
      context.moveTo(initialX, initialY);
      context.lineTo(e.clientX, e.clientY);
      context.stroke();
    } else if (currentShapeType === "Pencil") {
      currentPoints.push({ x: e.clientX, y: e.clientY });

      context.beginPath();
      context.moveTo(
        currentPoints[0]?.x as number,
        currentPoints[0]?.y as number
      );
      for (let i = 1; i < currentPoints.length; i++) {
        context.lineTo(
          currentPoints[i]?.x as number,
          currentPoints[i]?.y as number
        );
      }
      context.stroke();
    }
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
        centreX: initialX + (finalX - initialX) / 2,
        centreY: initialY + (finalY - initialY) / 2,
        radius: Math.abs(finalX - initialX) / 2,
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
    } else if (currentShapeType === "Line") {
      const newShape: Shape = {
        type: "Line",
        initialX,
        initialY,
        finalX,
        finalY,
      };
      if (
        Math.abs(newShape.initialX - newShape.finalX) > 0 ||
        Math.abs(newShape.initialY - newShape.finalY) > 0
      ) {
        setExistingShapes((prevShapes) => {
          const isDuplicate = prevShapes.some(
            (shape) => JSON.stringify(shape) === JSON.stringify(newShape)
          );
          return isDuplicate ? prevShapes : [...prevShapes, newShape];
        });

        await chat(roomId, JSON.stringify(newShape), wss);
      }
    } else if (currentShapeType === "Pencil") {
      if (currentPoints.length >= 2) {
        const newShape: Shape = {
          type: "Pencil",
          points: [...currentPoints],
        };

        setExistingShapes((prevShapes) => {
          const isDuplicate = prevShapes.some(
            (shape) => JSON.stringify(shape) === JSON.stringify(newShape)
          );
          return isDuplicate ? prevShapes : [...prevShapes, newShape];
        });

        await chat(roomId, JSON.stringify(newShape), wss);
      }

      currentPoints = [];
    }
  };

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);

  return () => {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mouseup", handleMouseUp);
    canvas.removeEventListener("mousemove", handleMouseMove);
  };
}
