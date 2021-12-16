import {http} from "filedropd";

export default function error() {
  const send = http.http500();

  return function error(err, req, res, next) {
    console.error(err.message);
    send(req, res);
  }
}
