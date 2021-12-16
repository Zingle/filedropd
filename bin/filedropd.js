#!/usr/bin/env node

import express from "express";
import basic from "express-basic-auth";
import morgan from "morgan";
import tlsopt from "tlsopt";
import {clean, configure, drop, error, fail, http, pickup} from "filedropd";

try {
  const app = express();
  const server = tlsopt.createServerSync(app);
  const {port, dir, user, password} = configure(process.env);

  app.use(basic({users: {[user]: password}, unauthorizedResponse: "Unauthorized\n"}));
  app.use(morgan("tiny"));
  app.post("/drop", drop(dir));
  app.get("/pickup/:id", pickup(dir));
  app.delete("/pickup/:id", clean(dir));
  app.all("/drop", http.http405("POST"));
  app.all("/pickup/:id", http.http405("GET", "DELETE"));
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
