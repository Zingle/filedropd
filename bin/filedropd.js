#!/usr/bin/env node

import express from "express";
import tlsopt from "tlsopt";
import {configure, fail} from "filedropd";

try {
  const app = express();
  const server = tlsopt.createServerSync(app);
  const {port} = configure(process.env);

  server.listen(port, () => logServerInfo(server));
} catch (err) {
  fail(err);
}

function logServerInfo(server) {
  const {address, family, port} = server.address();
  const host = family === "IPv6" ? `[${address}]` : address;
  console.info(`listening on ${host}:${port}`);
}
