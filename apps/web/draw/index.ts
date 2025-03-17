type Shape =
  | { type: "Rect"; x: number; y: number; width: number; height: number }
  | { type: "Circle"; centreX: number; centreY: number; radius: number };

export let existingShapes: Shape[] = [];

export default function InitDraw(canvas: HTMLCanvasElement) {
  if (canvas) {
    const context = canvas.getContext("2d");

    if (!context) return;

    let initialX = 0;
    let finalX = 0;
    let initialY = 0;
    let finalY = 0;
    let isClicked = false;

    clearCanvas(existingShapes, canvas, context);

    canvas.addEventListener("mousedown", (e) => {
      isClicked = true;
      initialX = e.clientX;
      initialY = e.clientY;
    });

    canvas.addEventListener("mouseup", (e) => {
      isClicked = false;
      finalX = e.clientX;
      finalY = e.clientY;
      existingShapes.push({
        type: "Rect",
        x: initialX,
        y: initialY,
        width: finalX - initialX,
        height: finalY - initialY,
      });
    });

    canvas.addEventListener("mousemove", (e) => {
      if (isClicked) {
        clearCanvas(existingShapes, canvas, context);
        context.strokeStyle = "rgba(255, 255, 255)";
        context.strokeRect(
          initialX,
          initialY,
          e.clientX - initialX,
          e.clientY - initialY
        );
      }
    });
  }
}

export function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.map((shape) => {
    if (shape.type == "Rect") {
      context.strokeStyle = "white";
      context.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}
