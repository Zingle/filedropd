import {PassThrough} from "stream";
import bytesized from "bytesized";

export default function limit(limit) {
  const stream = new PassThrough();
  let passed = 0;

  limit = bytesized(limit);

  return stream.on("data", chunk => {
    passed += String(chunk).length;
    if (passed > limit) {
      stream.emit("error", new Error("limit reached"));
    }
  });
}
