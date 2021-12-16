import {randomBytes} from "crypto";

export default function genid() {
  return randomBytes(8).toString("hex");
}
