import express, { Application, Request, Response } from "express";
import { createWriteStream } from "fs";
import bodyParser from "body-parser";
import { limiter } from "./utils/limiter.mjs";

const outPutFile = createWriteStream("output.ndjson");
const app: Application = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(limiter);

app.post("/", async (req: Request, res: Response) => {
  outPutFile.write(JSON.stringify(req.body) + "\n");
  res.status(200).json({ ok: "done" });
});

app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
