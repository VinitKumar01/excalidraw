import express from "express";
import { UserRouter } from "./routes/route.js";
import { PORT } from "@repo/common-variables/config";

console.log(PORT);

const port = PORT;

const app = express();
app.use(express.json());

app.use("/api/v1/user", UserRouter);

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
