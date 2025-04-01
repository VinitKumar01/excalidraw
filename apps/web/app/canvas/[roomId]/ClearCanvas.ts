import { Shape } from "./InitDraw";

export default function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "white";

  existingShapes.forEach((shape) => {
    if (shape.type === "Rect") {
      context.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "Circle") {
      context.beginPath();
      context.arc(shape.centreX, shape.centreY, shape.radius, 0, 2 * Math.PI);
      context.stroke();
    } else if (shape.type === "Line") {
      context.beginPath();
      context.moveTo(shape.initialX, shape.initialY);
      context.lineTo(shape.finalX, shape.finalY);
      context.stroke();
    } else if (shape.type === "Pencil" && Array.isArray(shape.points)) {
      const points = shape.points;
      if (points.length < 2) return;

      context.beginPath();
      context.moveTo(points[0]?.x as number, points[0]?.y as number);
      for (let i = 1; i < points.length; i++) {
        context.lineTo(points[i]?.x as number, points[i]?.y as number);
      }
      context.stroke();
    } else if (shape.type === "Text") {
      context.font = "48px serif";
      context.fillStyle = "white";
      context.fillText(shape.text, shape.x, shape.y);
    }
  });
}
