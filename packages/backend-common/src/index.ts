import dotenv  from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const PORT = process.env.PORT;