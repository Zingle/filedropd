#!/usr/bin/env node

import express from "express";
import basic from "express-basic-auth";
import tlsopt from "tlsopt";
import {configure, error, fail, http} from "filedropd";

try {
  const app = express();
  const server = tlsopt.createServerSync(app);
  const {port, dir, user, password} = configure(process.env);

  app.use(basic({users: {[user]: password}, unauthorizedResponse: "Unauthorized\n"}));
  app.all("*", http.http404());
  app.use(error());

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
