export default function InitDraw(canvas: HTMLCanvasElement) {
  if (canvas) {
    const context = canvas.getContext("2d");

    if (!context) return;

    context.fillStyle = "rgba(0, 0, 0)";
    context.fillRect(0, 0, 1080, 1080);

    let initialX = 0;
    let finalX = 0;
    let initialY = 0;
    let finalY = 0;
    let isClicked = false;

    canvas.addEventListener("mousedown", (e) => {
      isClicked = true;
      initialX = e.clientX;
      initialY = e.clientY;
    });

    canvas.addEventListener("mouseup", (e) => {
      isClicked = false;
      finalX = e.clientX;
      finalY = e.clientY;
    });

    canvas.addEventListener("mousemove", (e) => {
      if (isClicked) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(0, 0, canvas.width, canvas.height);
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
