#!/usr/bin/env node

import express from "express";
import tlsopt from "tlsopt";
import {configure, fail} from "filedropd";

try {
  const app = express();
  const server = tlsopt.createServerSync(app);
  const {port, dir, secret} = configure(process.env);

  server.listen(port, () => {
    console.info(listenInfo(server));
    console.info("serving files from", dir);
  });
} catch (err) {
  fail(err);
}

function listenInfo(server) {
  const {address, family, port} = server.address();
  const host = family === "IPv6" ? `[${address}]` : address;
  return `listening on ${host}:${port}`;
}
