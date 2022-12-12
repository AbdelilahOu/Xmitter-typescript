import { Transform, TransformCallback } from "stream";

export default class ThrottleRequest extends Transform {
  #requestPerS = 0;
  #counter = 0;
  constructor({ objectMode, requestPerS }) {
    super({
      objectMode,
    });
    this.#requestPerS = requestPerS;
  }
  _transform(
    chunk: any,
    enc: BufferEncoding,
    callback: TransformCallback
  ): void {
    this.#counter++;
    if (!(this.#counter >= this.#requestPerS)) {
      return callback(null, chunk);
    }

    setTimeout(() => {
      this.#counter = 0;
      return callback(null, chunk);
    }, 1000);
  }
}
