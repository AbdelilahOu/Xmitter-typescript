import { Transform, TransformCallback } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createReadStream } from "node:fs";
import { randomUUID } from "crypto";
import csvtojson from "csvtojson";
import readline from "node:readline";
import ThrottleRequest from "./throttle.js";

const Throttle = new ThrottleRequest({
  objectMode: true,
  requestPerS: 5,
});

// crrate a transform
const dataProcessor = new Transform({
  objectMode: true,
  transform(chunk: any, enc: BufferEncoding, callback: TransformCallback) {
    // we get the data as buffer
    const data = JSON.parse(chunk.toString());
    data.id = randomUUID();
    console.log(data);
    return callback(null, JSON.stringify(data));
  },
});

await pipeline(
  //   create a read stream
  createReadStream("big.csv"),
  //   turn the csv data into json data
  csvtojson(),
  //   our own processed data
  dataProcessor,
  //   define how many req per sec
  //  if we reched the limit
  //  wait till the time has passed and continue
  Throttle,
  //   send the data to the server
  async function* (source) {
    let counter: number = 0;
    for await (const data of source) {
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`processed items ... ${++counter}`);
      const status = await sendRequest(data);
      //   check we reached the requests limite
      if (status !== 200) {
        throw new Error("limite reached");
      }
    }
  }
);

async function sendRequest(data: string): Promise<number> {
  const req = await fetch("http://localhost:3000", {
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  return req.status;
}
