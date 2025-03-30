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
    }
  });
}
