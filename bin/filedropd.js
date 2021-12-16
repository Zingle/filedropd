#!/usr/bin/env node

import express from "express";
import tlsopt from "tlsopt";

const app = express();
const server = tlsopt.createServerSync(app);

server.listen(() => logServerInfo(server));

function logServerInfo(server) {
  const {address, family, port} = server.address();
  const host = family === "IPv6" ? `[${address}]` : address;
  console.info(`listening on ${host}:${port}`);
}
