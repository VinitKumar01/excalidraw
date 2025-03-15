import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

//@ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET;
export const BACKEND_URL = process.env.BACKEND_URL;
